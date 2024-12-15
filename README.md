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
