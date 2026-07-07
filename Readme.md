\# Localyze - Project Setup Guide



This guide explains how to clone, configure, and run the \*\*Localyze\*\* monorepo project.



\## Prerequisites



Make sure the following software is installed on your system:



\### Frontend

\- Visual Studio Code

\- Node.js (LTS version recommended)

\- npm (comes with Node.js)



Verify installation:



```bash

node -v

npm -v

```



\### Backend

\- Eclipse IDE for Enterprise Java and Web Developers

\- Java JDK 17 

\- Apache Maven (optional if using Eclipse EE Java and Web Developers)



Verify installation:



```bash

java -version

mvn -version //optional

```



\### Database

Install and start:



\- MySQL 8.x



\---



\# Clone the Repository



```bash

git clone https://github.com/<your-username>/<repository-name>.git

```



Move into the project directory:



```bash

cd <repository-name>

```



Example folder structure:



```

repository-name/

│

├── frontend/      # React Application

├── backend/       # Spring Boot Application

└── README.md

```



\---



\# Backend Setup (Spring Boot)



\## Step 1: Open in Eclipse



1\. Open Eclipse.

2\. Select your workspace.

3\. Click



```

File → Import

```



4\. Choose



```

Maven → Existing Maven Projects

```



5\. Browse to



```

repository-name/backend

```



6\. Click \*\*Finish\*\*.



Wait for Maven dependencies to download.



\---



\## Step 2: Configure Database



Open



```

src/main/resources/



```

paste application.yml 

(sent on wahtsapp group)



change database credentials 
and API keys(If required).

\---



\## Step 3: Build the Project



Right-click the project



```

Maven → Update Project

```



or from terminal:



```bash

mvn clean install

```



\---



\## Step 4: Run the Backend



Locate the main Spring Boot class.



Example:



```java

LocalyzeApplication.java

```



Right-click →



```

Run As → Spring Boot App

```



or



```

Run As → Java Application

```



Backend should start at



```

http://localhost:8080

```



\---



\# Frontend Setup (React)



\## Step 1: Open in VS Code



Open Visual Studio Code.



Choose



```

File → Open Folder

```



Select



```

repository-name/frontend

```



\---



\## Step 2: Install Dependencies



Open the VS Code terminal.



Run



```bash

npm install

```



This installs all packages listed in `package.json`.



\---



\## Step 3: Start the React App



Run



```bash

npm run dev

```



Vite will display something similar to:



```

Local: http://localhost:5173

```



Open this URL in your browser.



\---



\# Running the Complete Project



\### Terminal 1



Run the Spring Boot backend.



```

http://localhost:8080

```



\### Terminal 2



Run the React frontend.



```

http://localhost:5173

```



The frontend will communicate with the backend through the configured API URL.



\---



\# Useful Commands



\### Frontend



Install dependencies



```bash

npm install

```



Start development server



```bash

npm run dev

```



\# Troubleshooting



\## Backend won't start



\- Verify MySQL is running.

\- Check database credentials.

\- Ensure Java version matches the project requirements.

\- Update Maven dependencies (`Maven → Update Project`).



\---



\## Frontend won't start



Delete dependencies and reinstall:



```bash

rm -rf node\_modules

```



```bash

npm install

```



\---



\## API requests fail



\- Ensure the backend is running on `http://localhost:8080`.

\- Verify the frontend `.env` file points to the correct backend URL.

\- Confirm CORS is configured correctly in the Spring Boot application.



\---



\# Technologies Used



\### Frontend



\- React

\- Vite

\- JavaScript

\- Axios



\### Backend



\- Spring Boot

\- Spring Security

\- Spring Data JPA

\- Maven



\### Database



\- MySQL



\---



\# Project Structure



```

repository-name/

│

├── backend/

│   ├── src/

│   ├── pom.xml

│   └── ...

│

├── frontend/

│   ├── src/

│   ├── package.json

│   └── ...

│

└── README.md

```



\---



\# Contributors



Clone the repository, create a feature branch, commit your changes, and submit a pull request for review.

