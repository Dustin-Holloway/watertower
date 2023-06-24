#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
# from app import app
from config import app
from models import db, User, Listing, Comment, Document, Message

fake = Faker()

# if __name__ == "__main__":


    # Create seed data
with app.app_context():
    print("Starting seed...")

    # Delete existing data
    db.drop_all()
    db.create_all()

    Document.query.delete()
    for _ in range(8):
        doc = Document(
            filename=fake.file_name(),
            title=fake.catch_phrase())
        
        db.session.add(doc)
    db.session.commit()

    # Seed users
    User.query.delete()
    for _ in range(5):
        user = User(
            username=fake.user_name(),
            password=fake.password(),
            name=fake.name(),
            image=fake.image_url(),
            unit=fake.random_int(min=1, max=10),
        )
        db.session.add(user)

    db.session.commit()

    # Seed listings
    Listing.query.delete()
    users = User.query.all()
    for _ in range(10):
        listing = Listing(
            image=fake.image_url(),
            title=fake.sentence(),
            content=fake.paragraph(),
            user=fake.random_element(users),
        )
        db.session.add(listing)

    db.session.commit()

    # Seed comments
    Message.query.delete()
    messages = Message.query.all()
    for _ in range(20):
        message = Message(

            content=fake.sentence(),

        )
        db.session.add(message)

    db.session.commit()

    print("Seed completed successfully.")
