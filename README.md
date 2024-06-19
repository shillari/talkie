# Talkie
Talkie is a chat application designed to connect people in a single room, facilitating easy and seamless communication.

## Features
- Real-time Messaging: Send and receive messages in real time.
- Anonymous Authentication: New users can join anonymously without the need for account creation.
- [__Google Firestore__](https://firebase.google.com/) Integration: Messages are securely stored in Google Firestore Database.

## Messages Storage
The app uses Google Firestore Database to store and manage messages. This ensures that all chat data is securely stored and easily retrievable.

## Authentication
New users are authenticated anonymously using Firebase Authentication, allowing them to join the chat without needing to create an account.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/shillari/talkie.git

2. Navigate to the project directory:

   ```sh
   cd talkie

3. Install the dependencies:

   ```sh
   npm install

4. Start the development server:

   ```sh
   npm start

## Usage
- Open the Expo Go app on your mobile device.
- Scan the QR code displayed in the terminal after starting the development server.
- Enter your name, join a chat room and start messaging!
