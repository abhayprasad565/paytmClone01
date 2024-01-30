# AamPay - MERN Stack Payments Wallet Web App



## Overview

AamPay is a robust payments wallet web application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It is designed to implement secure and efficient transactions, ensuring a seamless user experience.

## Features

- **MERN Stack Magic**: Leverage the power of MongoDB, Express.js, React, and Node.js for a scalable and flexible application.
- **Secure Transactions**: Implementing sessions for error handling and utilizing JSONWEBTOKEN and bcrypt for authentication.
- **Database Consistency**: Ensure database integrity through atomic execution of related deduction and increment operations in transactions.

## How it Works

A transaction in AamPay treats a group of related operations as a single, indivisible unit. In the event of an error, the system can roll back changes to maintain consistency and return to the previous state. This prevents interleaved or incomplete changes, preserving the integrity and consistency of the database.

## Getting Started

### Prerequisites

- MongoDB
- Node.js and npm

### Installation

1. Clone the repository: `git clone https://github.com/abhayprasad565/paytmCLone01.git`
2. Navigate to the project directory: `cd paytmClone01`
2. Navigate to the backend directory: `cd paytmClone01/backend`
2. Navigate to the frontend directory: `cd paytmClone01/frontend`
3. Install dependencies: `npm install`
4. Configure your MongoDB connection in `config/db.js`.
5. Start the application: `npm start`

## Contributing

Contributions are welcome! If you'd like to contribute

## Contact

For inquiries, please contact @abhayprasad565
