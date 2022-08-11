# Clase_30

# PROXY: 
Servidor itnermediario que permite entre otras cosas:
    balancear carga
    aplicar middlewares (autenticacion x ej)
    aislar las partres en una  peticion (seguridad, el server no sabe quien le hace el request x ej)
    cachear informacion para que no haya que ir a buscarla al backend necesariamente

# TIPOS DE PROXY:
    Directo: Usuarios => Proxy => Internet => Servidores Backend
    Reverso: Usuarios => Internet => Proxy => Servidores Backend

    Estos dos tipos de arquitectura pueden combinarse.

# BENEFICIOS DE UN PROXY REVERSO EN BACKEND:
    Se pueden usar librerias o hacerlo a mano.
        [1] Balanceador de Carga: unioco punto de entrada. Se van redirijiendo a disitnots servidores.
        [2] Seguridad: se oculta la IP del servidor.
        [3] Caching: archivos estraticos pueden almacernase en memoria cache en el proxy reverso. Se puede confirgurar una cache que este 'viva' por XX horas. Esto permite quitar carga al sistema backend.
        [4] Compresion: minimizar las respuestas que hay entre el proxy y el backend. Se comprime la transmision de informacion entre server y proxy.
        [5] Cifrado SSL Optmizado (HTTPS): con un proxy reverso se puede implementar. Se puede proteger con HTTPS la transmision via internet hasta el proxy y luego la transmision del proxy al server puede ir sin proteccion. IOncluso puede que el servidor no este en internet sino que este en una red local.
        [6] Monitoreo y Registro de Treafico: llevar auditoria / monitoreo del sistema. Sirve cuando tenemos levantados varios servidores y queremos tener ciertas metricas dfe uso por ejemplo. En vez de contar ingresos  en cada servidor, se cuentan ingresos en el proxy (es decir, antes de que redirijan los requests a los servidores)

# PROXY PROGRAMATICO
    [EXPLICACION] No es muy utilizado. Consiste en la utilizacion de una libreria disenada para hacer de proxy. EN la calse se realilzo un ejemplo donde se descargo una libreria de NPM y se la implemento. Con PM2 se levantaron 2 apis que corren en local host pero en puertos distintos. Utilizando la libreria instalada se levanta con PM2 un 3er archivo que es el Proxy y que esta levantado en localhost:3000. Alli se configura que, dependiendo de la ruta a la cual se accede en el proxy, este redirecciona a alguno de los dos servidores levantados anteriormente.

# NGINX
EC2: 
    Definicion: servicio de AWS que permiote la creacion en la nube de una maquina virtual.
    Par de Claves: nos va a permitir conectarnos a la maquina virtual desde nuestra terminal.

Cuando navegamos en internet nunca accedfemos a un puerto en especifico. Esto es porque en HTTP se accede por default al puerto 80.

COMANDOS UBUNTU:
    SUDO: super usuario
    APT: manejador de paquete de ubuntu
    sudo apt update && sudo apt upgrade => permite actualizar todos los paquetes y librerias.
    sudo apt install nginx -y => Instalo NGINX
    systemctl status nginx => STATUS: permite ver el status de nginx
    sudo systemctl stop nginx => STOP: detiene la operacion del programa. Es necesario ekjecutarlo con SUDO
    sudo systemctl start nginx => START
    sudo systemctl restart nginx => RESTART

    [NOTA]: Siempre que se haga una modificacion en NGINX se lo debe reiniciar para que apliquen los cambios.

    curl: permite hacer peticiones HTTP desde la consola. Ej.: curl http://localhost
    
    [NOTA]: Automaticamente NGINX genera un HTML por default. Dicho HTML puede ser accedido si uno ingresa al PROXY que levanto NGINX en la instancia de EC2. Esto se hace a traves de la Ipv4 publica que nos da EC2. Ej.: 35.173.242.106

    cat: es un comando que nos permite VER (read) un archivo en ubuntu
    Comentar: en ubuntu se comenta con '#'

    NGINX: tiene 2 archivos importantes: 
        /etc/nginx/nginx.conf

        Se tiene 2 carpetas:
        sites-enabled: lugar de donde nginx toma los archivos de conbfiguracion. Tiene archivos fgicticios que apuntan a otros archivos
        sites-available: lugar donde estan los archivos como tales
    
    pwd: indica la carpeta donde uno esta parado
    vim: permite abrir un editor y editar un archivo