# Usa uma imagem oficial do Nginx, que é um servidor web leve e eficiente.
# A tag "alpine" indica uma versão menor da imagem, ideal para containers.
FROM nginx:alpine

# Copia todos os seus arquivos estáticos (HTML, CSS, JS)
# para o diretório padrão do Nginx que serve sites.
COPY . /usr/share/nginx/html