sudo docker stop generateur-blague &&
sudo docker rm generateur-blague &&
sudo docker image build -t generateur-blague . &&
sudo docker container run --name generateur-blague -d -p 8080:8080 generateur-blague-server:1.0