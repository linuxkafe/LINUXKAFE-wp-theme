from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# Define secret key and algorithm
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create FastAPI instance
app = FastAPI()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# In-memory user data (for demo purposes)
fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "full_name": "John Doe",
        "email": "user@example.com",
        "hashed_password": "fakehashedsecret",
        "disabled": False,
    }
}

# Function to verify the password and authenticate user
def verify_password(plain_password, hashed_password):
    return plain_password == hashed_password

# Function to get a user given the email
def get_user(db, username: str):
    if username in db:
        return db[username]
    return None

# Function to create the JWT token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Token endpoint for authentication
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(fake_users_db, form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route example
@app.get("/protected")
async def read_protected(token: str = Depends(oauth2_scheme)):
    return {"message": "Success! You are authenticated."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv('BROKER_PORT', 8000))  # Use environment variable or default 8000
    uvicorn.run(app, host="0.0.0.0", port=port)