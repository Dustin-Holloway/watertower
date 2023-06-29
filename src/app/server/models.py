from sqlalchemy import MetaData, ForeignKey
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from flask import current_app
from werkzeug.utils import secure_filename
import os

from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    name = db.Column(db.String)
    image = db.Column(db.String)
    unit = db.Column(db.Integer)

    listings = db.relationship("Listing", back_populates="user")
    comments = db.relationship("Comment", back_populates="user")
    favorites = db.relationship("Favorite", back_populates="user")

    favorited_listings = association_proxy("favorites", "listing")
    messages = db.relationship("Message", back_populates="user")

    serialize_rules = (
        "-listings.user",
        "-comments.user",
        "-favorites.user",
        "-messages",
    )

    @property
    def password(self):
        raise AttributeError("Password is not readable")

    @password.setter
    def password(self, value):
        if self._password_hash is None:
            # User signing up with a password for the first time
            self._password_hash = bcrypt.generate_password_hash(value.encode("utf-8"))
        else:
            # Updating the password
            self.set_password(value)

    def set_password(self, new_password):
        self._password_hash = bcrypt.generate_password_hash(
            new_password.encode("utf-8")
        )

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))


class Listing(db.Model, SerializerMixin):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    image = db.Column(db.String)
    title = db.Column(db.String)
    content = db.Column(db.String)
    type = db.Column(db.String)

    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    user = db.relationship("User", back_populates="listings")
    comments = db.relationship("Comment", back_populates="listing")

    serialize_rules = (
        # "-user",
        "-comments",
    )


class Comment(db.Model, SerializerMixin):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    comment_type = db.Column(db.String)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    listing_id = db.Column(db.Integer, ForeignKey("listings.id"))
    user_id = db.Column(db.Integer, ForeignKey("users.id"))

    user = db.relationship("User", back_populates="comments")
    listing = db.relationship("Listing", back_populates="comments")
    favorite = db.relationship("Favorite", back_populates="comment")

    serialize_rules = ("-user", "-listings")


class Favorite(db.Model, SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    comment_id = db.Column(db.Integer, ForeignKey("comments.id"))

    user = db.relationship("User", back_populates="favorites")
    comment = db.relationship("Comment", back_populates="favorite")


class Message(db.Model, SerializerMixin):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    parent_message_id = db.Column(db.Integer, ForeignKey("messages.id"))

    user = db.relationship("User", back_populates="messages")
    replies = db.relationship("MessageReply", back_populates="message")

    # serialize_rules = ("user")


class ListingReply(db.Model, SerializerMixin):
    __tablename__ = "listing_replies"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    listing_id = db.Column(db.Integer, ForeignKey("listings.id"))

    user = db.relationship("User")
    listing = db.relationship("Listing")


class MessageReply(db.Model, SerializerMixin):
    __tablename__ = "message_replies"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    message_id = db.Column(db.Integer, ForeignKey("messages.id"))

    user = db.relationship("User")
    message = db.relationship("Message")

    serialize_rules = ("-message", "-message_id", "-user_id")


class Notification(db.Model, SerializerMixin):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    user_id = db.Column(db.Integer, ForeignKey("users.id"))
    listing_id = db.Column(db.Integer, ForeignKey("listings.id"))

    user = db.relationship("User")
    listing = db.relationship("Listing")


class Document(db.Model, SerializerMixin):
    __tablename__ = "documents"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255))
    title = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    file_path = db.Column(db.String(255))  # Add a file_path column

    # Other columns and relationships

    data = db.Column(db.LargeBinary)  # Assuming you want to store the file data

    def save_pdf(self, uploaded_file):
        # Generate a secure filename
        filename = secure_filename(uploaded_file.filename)

        # Create the file path where the file will be stored
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)

        # Save the file to the file system
        uploaded_file.save(file_path)

        # Set the model attributes
        self.filename = filename
        self.file_path = file_path

    def get_file_path(self):
        return self.file_path

    def write_pdf(self, file_path):
        with open(file_path, "wb") as file:
            file.write(self.data)
