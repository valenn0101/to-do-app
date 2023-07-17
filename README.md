
# Todo App Backend

Esta aplicacion permite que los usuarios registrados puedan crear proyectos en equipo o individuales y asignar listados de tarea para cada uno.

Cuenta con un proceso de autenticacion para poder realizar los distintos metodos HTTP a excepcion de la creacion de usuarios. Se utilizaron Guard y Decoradores para este trabajo.

Ademas de contar con mensajes de error, pruebas unitarias y verificaciones internas con DTOs.

## Base de Datos

Se utilizó la tecnologia de PostgreSQL junto a Docker ya que mediante sus imagenes de DB permite trabajar con distintas versiones de cada DB. A demas de permitir una facil y sencilla creacion de las bases de datos.

![Diagrama ER de base de datos (to-do-app](https://github.com/valenn0101/to-do-app-backend/assets/105892117/36a5856f-a75b-41ca-8243-2adab2da52eb)

Como pueden ver en el Diagrama Modelo Entidad-Relacion se establecieron distintas relaciones entre las tablas utilizando tambien tablas intermediarias para lograr esto. Gracias a TypeORM se facilitó mucho el diseño de este modelo.
La tabla 'Users' debe tener una relacion 'zero-to-many' con 'Projects' ya que un usuario puede tener cero o muchos proyectos, en cambio un proyecto tiene la relacion 'one-to-many' con la tabla 'Users' ya que si existe un proyecto este tiene por lo menos un usuario.
Luego con las tareas y proyectos estos tienen una relacion 'zero-to-many' ya que un proyecto puede tener ninguna o muchas tareas pero las tareas tienen la relacion 'one-to-one' ya que una tarea pertenece a un solo proyecto.
