# ModernDb

To run website, 
1. make sure you have node js downloaded from the website
2. clone the repo
3. Start your redis and MongoDB server
4. Run the following so start the server
```bash
    cd server
    pip install Flask
    python run_server.py
```
5. Run the following so start the client
```bash
    cd ../client
    npm install
    npm start
```
6. Navigate to localhost:3000 in your browser

# Other Information

##### The data files are found in /server/Data
##### If for some reason you need to change the default ports, you can update teh mongo config in main.py and character_func.py and the redis config in mbti_func.py
##### Our app uses the google context api to find images. If you would like to have images when you are using it, do the following

1. Create a .env file in the /server directory
2. Create an api key [here](https://developers.google.com/custom-search/docs/context)
3. Add the following code to the .env file
```bash
  API_KEY=YOUR_KEY_HERE
  SEARCH_ENGINE_ID=14253724b9f354b07
```
