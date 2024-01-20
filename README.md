# Fyle Web Development Internship - Github Repository Viewer

This project is a web application designed to display the public Github repositories belonging to any specific user. The main goal is to create a user-friendly interface that retrieves and displays repository information from the Github API.

## Requirements

1. **API Documentation**: The application uses the Github REST API to fetch repository data.
2. **Repository Topics Representation**: The application represents the topic of a particular repository. Keep in mind that one repository could have multiple topics.
3. **Server-side Pagination**: Pagination is implemented on the server side to optimize performance. By default, the application displays 10 repositories per page, and the user can choose a maximum of 100 repositories per page.
4. **Loaders for API Calls**: To enhance the user experience, loaders are displayed while API calls are in progress.
5. **Optional**: The application optionally provides a search bar to allow users to search any valid github profile.

## Technologies Used

1. HTML, CSS, JavaScript: The core technologies for building the web application.
2. Bootstrap: Used for styling and responsive design.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/SaquibShakeel/fyle-assignment.git
```
2. Open the index.html file in your preferred web browser.
2. Explore the Github repositories by entering a valid Github username.
3. Use the pagination controls to navigate through the repositories.

## Deployement

Hosted at https://fyle-assignment-one.vercel.app/

