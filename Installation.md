# Installation Guide

This guide will walk you through the installation process for setting up a development environment for your Travel Website project, which uses ReactJS for the front end and ExpressJS for the back end.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

- Node.js: Download and install Node.js from [nodejs.org](https://nodejs.org/).

## Clone the Repository

First, clone the Git repository for the Travel Website project to your local machine using the following command:

```git clone https://github.com/longpt271/e-commerce```


## Setting Up the Client Front End (ReactJS) (same with Admin FE)

1. Navigate to the `client` directory within the project folder:

```cd e-commerce/client```

2. Install the required Node modules by running:

```npm install```

3. Start the React development server:

```npm start```

The front end will be accessible at `http://localhost:3000`.

## Setting Up the Back End (ExpressJS)

1. Navigate to the `server` directory within the project folder:

`cd e-commerce/server`

2. Install the required Node modules by running:

`npm install`

3. Start the ExpressJS server:

`npm start`


The back end will run on `http://localhost:5000`.

## Environment Variables

Contact me to know database connection details, API keys, and any other sensitive information. You can use the `.env` file to customize these variables to your own.

## Running the Application

With both the front end and back end servers up and running, you should be able to access the Travel Website at `http://localhost:3000`. The React front end communicates with the ExpressJS back end to provide a seamless user experience.

Happy coding!
