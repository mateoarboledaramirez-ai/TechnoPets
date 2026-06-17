from flask import Flask, request, jsonify
import sys
import os

# Agregar la carpeta Control al path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "Control"))

from basededatospy import registrar_dueno, registrar_mascota

app = Flask(__name__)


@app.route("/")
def inicio():
    return "Servidor TechnoPets funcionando correctamente"


@app.route("/registro", methods=["POST"])
def registro():

    try:

        datos = request.get_json()

        nombre = datos["nombre"]
        correo = datos["correo"]
        telefono = datos["telefono"]
        direccion = datos.get("direccion", "Sin dirección")
        mascotas = datos["mascotas"]

        # Registrar dueño
        id_dueno = registrar_dueno(
            nombre,
            telefono,
            direccion,
            correo
        )

        # Registrar mascotas
        for mascota in mascotas:

            registrar_mascota(
                mascota["nombre"],
                mascota["especie"],
                mascota["raza"],
                mascota["edad"],
                mascota["sexo"],
                mascota["peso"],
                id_dueno
            )

        return jsonify({
            "success": True,
            "mensaje": "Registro realizado correctamente"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "mensaje": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)