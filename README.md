# Between

<div align="center">
  <a href="https://between.website/">
    <img src="public/img/logo.png"/>
  </a>
  <h4>Between helps you find someone that matches your personality.</h4>
  <h5>We use MBTI to feature yourself and your future friends.</h5>
</div>

## Demo
#### Website URL : https://between.website/
#### Test account
- Email: lola@gmail.com
- Password: lola
    
#### Select MBIT type
- Users can upload one image as prifile photo.
- Users can edit information and choose there own MBIT type.
<img src="public/img/member.gif"/>
  
#### Match with someone you like
- Users will only meet each person one time.
- Click the arrow button to switch the person.
- Click LIKE to wait for match success. 
<img src="public/img/match.gif"/>
    
#### Real-time chat
- Users can chat with friends when there is a match success.    
<img src="public/img/chat.gif"/>     
    
## Main Features
- Support signup locally and Google OAuth 2.0.
- Use Json Web Token to achieve authentication.
- Store user profile image in AWS S3 and use Cloud Front as CDN.
- Use AWS RDS as Database and set index to optimize query.
- Random same MBIT type person to user as first priority.
- Use Socket IO for real-time chat.
- Use AWS ElastiCache to improve loading speed for user's friend list and chatting history.
- Support mobile devises.


## System Architecture
<img src="public/img/structure.png"/>
    
## Database Schema
<img src="public/img/schema.png"/>
    
## Backend Technique
#### Deployment
- Docker

#### Environment
- Node.js/Express.js

#### Database
- MySQL

#### Cloud Service (AWS)
- EC2
- S3, CloudFront
- RDS
- ElastiCache
- Route 53

#### Networking
- HTTP & HTTPS
- Domain Name System
- NGINX
- SSL

#### Version Control
- Git/GitHub

#### Third Party Library 
- passport
- bcrypt
- multer

## Front-End Technique
- HTML
- CSS
- JavaScript
- AJAX

## Contact
- Hsin-I Chang
- Email: nancy65018@gmail.com
