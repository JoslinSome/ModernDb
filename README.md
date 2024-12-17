# ModernDb

To run website, 
1. make sure you have node js downloaded from the website
2. clone the repo
3. Start your redis and MongoDB server
4. Run the following so start the server
```bash
    cd server
    pip install flask
    python run_server.py
```
5. Make sure you have node installed 
6. Run the following so start the client
```bash
    cd client
    npm install
    npm start
```
7. Navigate to localhost:3000 in your browser

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

### Without the api key the app will still work but results will have no image like so
![Screenshot 2024-12-16 at 9.30.33 PM.png](..%2F..%2F..%2F..%2F..%2Fvar%2Ffolders%2F6n%2F5lbwzs7j2qq6bz2rhy3hphlm0000gn%2FT%2FTemporaryItems%2FNSIRD_screencaptureui_3BnYBY%2FScreenshot%202024-12-16%20at%209.30.33%20PM.png)