#!/bin/bash

echo 'run application_start.sh: ' >> /home/reservations/verte-charge-reservations-backend/deploy.log

echo 'pm2 restart nodejs-express-app' >> /home/ec2-user/nodejs-aws-codedeploy-pipeline/deploy.log
pm2 restart 0 >> /home/reservations/verte-charge-reservations-backend/deploy.log