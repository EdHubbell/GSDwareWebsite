GSDware website code. 

Moved to a Digital Ocean droplet on 4/15/18. The droplet was already running the blog.gsdware.com and blog.truxie.com (both Ghost)

Note that nginix config had to change to allow ssi (the includes statements in the html)

Note that at some point this site moved from Azure to a Digital Ocean droplet - 104.131.76.212. That droplet can be updated using Filezilla to upload content to the /var/www/gsdware.com folder. 

Site updates: 
4/16/2020 Changed site text to update wrong office address and to clean up some content from 2014. This should probably happen more than every 5 years or so. 


10/29/24 - Changed host to new DigitalOcean droplet. This was a big pain, which wasn't aided by the fact that I dropped the old droplet, and the one they replaced for me didn't have my new ssh key on it. 

installed nginx, Certbot, 


Certbot install from https://certbot.eff.org/instructions?ws=nginx&os=pip : 

sudo apt update
sudo apt install python3 python3-venv libaugeas0
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx

let certbot modify nginx for you
sudo certbot --nginx

configure auto renewal of https certificates
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/nul


Also, it would be a good idea to update the certbot version on the server occasionally. A la
sudo /opt/certbot/bin/pip install --upgrade certbot certbot-nginx



Another thing to remember is that you'll need to install node and then grunt on your box to make the website from the code here. 

