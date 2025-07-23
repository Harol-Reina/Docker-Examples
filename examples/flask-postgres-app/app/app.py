import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
from marshmallow import Schema, fields, ValidationError

# Configuración de la aplicación
app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:password@postgres:5432/test')
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar extensiones
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Modelos de la base de datos
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'age': self.age,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

# Esquemas de validación con Marshmallow
class UserSchema(Schema):
    name = fields.Str(required=True, validate=lambda x: len(x) > 0)
    email = fields.Email(required=True)
    age = fields.Int(validate=lambda x: x > 0 and x < 150)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Crear tablas si no existen
with app.app_context():
    db.create_all()

# Rutas de la aplicación

@app.route('/')
def index():
    """Información general de la API"""
    return jsonify({
        'message': '🚀 Flask + PostgreSQL API',
        'version': '1.0.0',
        'status': 'running',
        'timestamp': datetime.utcnow().isoformat(),
        'endpoints': {
            'GET /': 'Información de la API',
            'GET /health': 'Estado de salud',
            'GET /api/users': 'Obtener todos los usuarios',
            'POST /api/users': 'Crear nuevo usuario',
            'GET /api/users/<id>': 'Obtener usuario por ID',
            'PUT /api/users/<id>': 'Actualizar usuario',
            'DELETE /api/users/<id>': 'Eliminar usuario'
        }
    })

@app.route('/health')
def health_check():
    """Health check del servicio"""
    try:
        # Verificar conexión a la base de datos
        db.session.execute(db.text('SELECT 1'))
        db_status = 'connected'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/users', methods=['GET'])
def get_users():
    """Obtener todos los usuarios"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        users = User.query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'success': True,
            'data': [user.to_dict() for user in users.items],
            'pagination': {
                'page': users.page,
                'pages': users.pages,
                'per_page': users.per_page,
                'total': users.total
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error obteniendo usuarios',
            'error': str(e)
        }), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    """Crear un nuevo usuario"""
    try:
        # Validar datos de entrada
        data = user_schema.load(request.json)
        
        # Verificar si el email ya existe
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'El email ya está registrado'
            }), 400
        
        # Crear nuevo usuario
        new_user = User(
            name=data['name'],
            email=data['email'],
            age=data.get('age')
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Usuario creado exitosamente',
            'data': new_user.to_dict()
        }), 201
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'message': 'Datos de entrada inválidos',
            'errors': e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Error creando usuario',
            'error': str(e)
        }), 500

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Obtener un usuario por ID"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({
            'success': True,
            'data': user.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Usuario no encontrado',
            'error': str(e)
        }), 404

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Actualizar un usuario"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Validar datos de entrada
        data = user_schema.load(request.json, partial=True)
        
        # Verificar email único si se está actualizando
        if 'email' in data and data['email'] != user.email:
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return jsonify({
                    'success': False,
                    'message': 'El email ya está registrado'
                }), 400
        
        # Actualizar campos
        for key, value in data.items():
            setattr(user, key, value)
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Usuario actualizado exitosamente',
            'data': user.to_dict()
        })
        
    except ValidationError as e:
        return jsonify({
            'success': False,
            'message': 'Datos de entrada inválidos',
            'errors': e.messages
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Error actualizando usuario',
            'error': str(e)
        }), 500

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Eliminar un usuario"""
    try:
        user = User.query.get_or_404(user_id)
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Usuario eliminado exitosamente'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Error eliminando usuario',
            'error': str(e)
        }), 500

# Manejo de errores
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Recurso no encontrado',
        'error': 'Not Found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        'success': False,
        'message': 'Error interno del servidor',
        'error': 'Internal Server Error'
    }), 500

# Punto de entrada
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
