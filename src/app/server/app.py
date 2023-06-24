# !/usr/bin/env python3


from flask import request, session, make_response, jsonify, send_file
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from models import User, Listing, Comment, MessageReply, Message, Document
from config import api, db, app
import ipdb
from flask import render_template
import os
from flask import request
from flask_restful import Resource

# import ipdb



class NextAuthLogin(Resource):
    def post(self):
        try:
            json_data = request.get_json()
            email = json_data.get("email")
            name = json_data.get("name")
            image = json_data.get("image")
            username = json_data.get("username")

            if not email:
                response = make_response({"error": "Email is required."}, 400)
                return response

            # Here, you can perform any additional validation or checks you need
            user = db.session.query(User).filter_by(email=email).first()

            if not user:
                newUser = User(username=username, name=name, email=email, image=image)
                db.session.add(newUser)
                db.session.commit()

            response = make_response(jsonify({"success": True}), 200)
            return response

        except Exception as e:
            response = make_response({"error": str(e)}, 500)
            return response


class UserById(Resource):
    def get(self, id):
        user = db.session.query(User).filter_by(id=id).first()

        if user:
            return make_response(jsonify(user.to_dict()), 201)

        return make_response(jsonify({"error": "user not found!"}), 404)

    def patch(self, id):
        request_json = request.get_json()
        updated_user = User.query.filter(User.id == id).first()
        if updated_user:
            new_password = request_json.get("new_password")

            if new_password:
                updated_user.set_password(new_password)

            for key, value in request_json.items():
                if hasattr(updated_user, key):
                    setattr(updated_user, key, value)

            db.session.add(updated_user)
            db.session.commit()
            return make_response(jsonify(updated_user.to_dict()), 200)

        return make_response({"Error": "User not found"}, 404)


class Login(Resource):
    def post(self):
        try:
            json_data = request.get_json()
            email = json_data.get("email")
            password = json_data.get("password")

            if not email or not password:
                response = make_response(
                    {"error": "Email and password are required."}, 400
                )
                return response

            current_user = User.query.filter_by(email=email).first()
            if current_user and current_user.authenticate(password):
                session["user_id"] = current_user.id
                response = make_response(jsonify(current_user.to_dict()), 200)
                # ipdb.set_trace()
                return response
            else:
                response = make_response({"error": "Invalid password."}, 401)
                return response

        except Exception as e:
            response = make_response({"error": str(e)}, 500)
            return response


class Logout(Resource):
    def delete(self):
        if session["user_id"]:
            session["user_id"] = None
            return {}, 200
        else:
            response = make_response({}, 401)
            return response


class CheckSession(Resource):
    def get(self):
        if "user_id" in session:
            user = User.query.filter_by(id=session["user_id"]).first()
            if user:
                response = make_response(jsonify(user.to_dict()), 200)

                return response

        response = make_response({}, 401)
        return response


class NewUser(Resource):
    def post(self):
        request_json = request.get_json()

        try:
            new_user = User(
                password=request_json.get("password"),
                email=request_json.get("email"),
                name=request_json.get("name"),
                unit=request_json.get("unit"),
            )

            new_user.password = request_json.get("password")
            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id

            return make_response(jsonify(new_user.to_dict()), 201)

        except Exception:
            return make_response(jsonify({}), 400)


class Reply(Resource):
    def post(self):
        request_json = request.get_json()

        try:
            new_Reply = MessageReply(
                content=request_json.get("content"),
                user_id=session.get("user_id"),
                message_id=request_json.get("message_id"),
            )

            db.session.add(new_Reply)
            db.session.commit()

            return make_response(jsonify(new_Reply.to_dict()), 201)

        except Exception:
            return make_response(jsonify({}), 400)
        

class Messages(Resource):
    def get(self):
        messages = Message.query.all()

        if messages:
            return make_response(
                jsonify(
                    [
                        message.to_dict(only=("id", "content", "user_id", "created_at", "replies", "user" )
                            
                        )
                        for message in messages
                    ]
                ),
                200,
            )
        return make_response({"error": "no comments found"}, 404)
    
    def post(self):
        request_json = request.get_json()

        user_id = session.get("user_id")
        user = User.query.filter_by(id=user_id).first()


        try:
            new_Message = Message(
                content=request_json.get("content"),
                user=user,

            )

            db.session.add(new_Message)
            db.session.commit()

            return make_response(jsonify(new_Message.to_dict()), 201)

        except Exception:
            return make_response(jsonify({}), 400)


class UserComments(Resource):
    def get(self):
        new_listings = Comment.query.all()

        if new_listings:
            return make_response(
                jsonify(
                    [
                        comment.to_dict(
                            only=(
                                "comment_type",
                                "content",
                                "listing_id",
                                "id",
                                "user_id",
                                "created_at",
                                "user",
                            )
                        )
                        for comment in new_listings
                    ]
                ),
                200,
            )
        return make_response({"error": "no comments found"}, 404)

    def post(self):
        request_json = request.get_json()

        try:
            user_id = session.get("user_id")
            user = User.query.filter_by(id=user_id).first()
            # ipdb.set_trace()

            if not user:
                return make_response(
                    jsonify({"error": "User not found, please login"}), 401
                )

            new_comment = Comment(content=request_json.get("content"), user=user)

            db.session.add(new_comment)
            db.session.commit()

            return make_response(
                jsonify(new_comment.to_dict()),
                201,
            )

        except Exception:
            return make_response(jsonify({}), 400)


class UserCommentsById(Resource):
    def get(self, id):
        new_listing = Comment.query.get(id)

        if new_listing:
            return make_response(
                jsonify(new_listing.to_dict()),
                200,
            )
        return make_response({"error": "comment not found"}, 404)

    def delete(self, id):
        new_listing = Comment.query.get(id)

        if new_listing:
            db.session.delete(new_listing)
            db.session.commit()
            return make_response({}, 204)

    def patch(self, id):
        request_json = request.get_json()
        updated_comment = Comment.query.filter_by(id=id).first()
        if updated_comment:
            for key, value in request_json.items():
                if hasattr(updated_comment, key):
                    setattr(updated_comment, key, value)

            db.session.add(updated_comment)
            db.session.commit()
            return make_response(
                jsonify(updated_comment.to_dict(only=("id",))),
                201,
            )

        return make_response({"Error": "User not found"}, 404)


class ListingsById(Resource):
    def get(self, id):
        new_listing = Listing.query.get(id)

        if new_listing:
            return make_response(
                jsonify(new_listing.to_dict()),
                200,
            )
        return make_response({"error": "comment not found"}, 404)

    def delete(self, id):
        listing = Listing.query.get(id)

        if listing:
            db.session.delete(listing)
            db.session.commit()
            return make_response({}, 204)

    def patch(self, id):
        request_json = request.get_json()
        updated_comment = Listing.query.filter_by(id=id).first()
        if updated_comment:
            for key, value in request_json.items():
                if hasattr(updated_comment, key):
                    setattr(updated_comment, key, value)

            db.session.add(updated_comment)
            db.session.commit()
            return make_response(
                jsonify(updated_comment.to_dict(only=("id",))),
                201,
            )

        return make_response({"Error": "User not found"}, 404)


class Listings(Resource):
    def get(self):
        all_listings = Listing.query.all()

        if all_listings:
            return make_response(
                jsonify(
                    [
                        listing.to_dict(
                            only=("image", "title", "content", "id", "created_at", "user_id", "user.name", "user.email", "user.unit", "user.id")
                        )
                        for listing in all_listings
                    ]
                ),
                200,
            )
        return make_response({"error": "no comments found"}, 404)
    

    def post(self):
        request_json = request.get_json()

        try:
            new_Listing = Listing(
                title=request_json.get("title"),
                content=request_json.get("content"),
                image=request_json.get("image"),
                user_id=session.get("user_id"),
            )

            db.session.add(new_Listing)
            db.session.commit()

            return make_response(jsonify(new_Listing.to_dict()), 201)

        except Exception:
            return make_response(jsonify({}), 400)
    

class Documents(Resource):
    def get(self):
        docs = Document.query.all()

        if docs:
            return make_response(
                jsonify([doc.to_dict()
                        for doc in docs]
                    
                ),
                200,
            )
        return make_response({"error": "no comments found"}, 404)
    

class Files(Resource):
    def get(self):
        folder_path = 'os.path.join(app.config["UPLOAD_FOLDER"], "files")'
        file_names = os.listdir(os.path.join(app.config["UPLOAD_FOLDER"], "files"))

        # response = "\n \n \n Machinery_handbook.pdf\n \n"
        # file_names = [file_name.strip() for file_name in response.split('\n') if file_name.strip()]

        return render_template("files.html", file_names=file_names)
    



class DocumentsById(Resource):
     def get(self, id):
        docToGet = Document.query.get(id)

        if docToGet:
            return send_file(docToGet.file_path, as_attachment=True, mimetype='application/octet-stream')
        return make_response({"error": "document not found"}, 404)
     


     

api.add_resource(Logout, "/api/logout")
api.add_resource(CheckSession, "/api/check_session")
api.add_resource(Login, "/api/login")
api.add_resource(NextAuthLogin, "/api/authlogin")
api.add_resource(Files, "/api/files")
api.add_resource(Documents, "/api/documents")
api.add_resource(DocumentsById, "/api/documents/<int:id>")
api.add_resource(UserById, "/api/users/<int:id>")
api.add_resource(NewUser, "/api/new_user")
api.add_resource(Reply, "/api/reply")
api.add_resource(UserCommentsById, "/api/comments/<int:id>")
api.add_resource(UserComments, "/api/comments")
api.add_resource(Listings, "/api/listings")
api.add_resource(ListingsById, "/api/listings/<int:id>")
api.add_resource(Messages, "/api/messages")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
