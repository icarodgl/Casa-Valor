# max=3
# for i in `seq 1 $max`
# do
#     node ./scraping-node/index page=2 filename=dados_$i.json
# done
for i in $(cat estados.txt) 
do  npm start -- -m -p 100 -s $i -pg
done