# max=3
# for i in `seq 1 $max`
# do
#     node ./scraping-node/index page=2 filename=dados_$i.json
# done
for i in $(cat estados.txt) 
do  node ./scraping-node/index number=100 filename=dados/dados_$i.json state=$i
done