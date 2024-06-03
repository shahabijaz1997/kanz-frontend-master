#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/nodejs-aws-codedeploy-pipeline/deploy.log

echo 'cd /home/ec2-user/nodejs-server-cicd' >> /home/ec2-user/nodejs-aws-codedeploy-pipeline/deploy.log
cd /home/reservations/verte-charge-reservations-backend >> /home/reservations/verte-charge-reservations-backend/deploy.log

echo 'npm install' >> /home/reservations/verte-charge-reservations-backend/deploy.log 
npm install >> /home/reservations/verte-charge-reservations-backend/deploy.log