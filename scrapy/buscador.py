# -*- coding: utf-8 -*-
"""
Created on Wed Aug 16 11:10:41 2017

@author: icaro
"""

from bs4 import BeautifulSoup as bs
import requests

dados =[]

for i in range (101):
    print(str(i)+"0%")
    page = requests.get("http://es.olx.com.br/imoveis?o=" + str(i))
    soup = bs(page.content,"html.parser")
    
    preco = soup.find_all("p", class_="OLXad-list-price")
    local = soup.find_all("p", class_="text detail-region")
    cat = soup.find_all("p", class_="text detail-category")
    
    for j in range(len(preco)):
        dicio = {
            "local": str(local[j]).split()[3:-4],
            "valor": int(str(str(preco[j]).split()[3].replace("</p>","")).replace('.','')),
            "categoria": str(str(cat[j]).split()[3])  
            }
        dados.append(dicio)
    
for h in dados:
    lista=[]
    palavra = ""
    for junta in h["local"]:
        palavra +=junta
    if (palavra not in lista):
        lista.append(palavra)
        

      
    print( lista)
    
    