import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''Регистрация и авторизация пользователей в wix мессенджере'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')  # 'register' or 'login'
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        if action == 'register':
            phone = body.get('phone')
            nickname = body.get('nickname')
            username = body.get('username')
            avatar = body.get('avatar', '👤')
            
            if not phone or not nickname or not username:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'phone, nickname и username обязательны'}),
                    'isBase64Encoded': False
                }
            
            # Проверка существования пользователя
            cur.execute("SELECT id FROM users WHERE phone = %s OR username = %s", (phone, username))
            existing = cur.fetchone()
            
            if existing:
                return {
                    'statusCode': 409,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Пользователь уже существует'}),
                    'isBase64Encoded': False
                }
            
            # Создание пользователя
            cur.execute(
                "INSERT INTO users (phone, nickname, username, avatar) VALUES (%s, %s, %s, %s) RETURNING id",
                (phone, nickname, username, avatar)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            
            # Получение данных пользователя
            cur.execute(
                "SELECT id, phone, nickname, username, avatar, is_premium FROM users WHERE id = %s",
                (user_id,)
            )
            user = cur.fetchone()
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user[0],
                        'phone': user[1],
                        'nickname': user[2],
                        'username': user[3],
                        'avatar': user[4],
                        'is_premium': user[5]
                    }
                }),
                'isBase64Encoded': False
            }
            
        elif action == 'login':
            phone = body.get('phone')
            
            if not phone:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'phone обязателен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "SELECT id, phone, nickname, username, avatar, is_premium FROM users WHERE phone = %s",
                (phone,)
            )
            user = cur.fetchone()
            
            cur.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Пользователь не найден'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'user': {
                        'id': user[0],
                        'phone': user[1],
                        'nickname': user[2],
                        'username': user[3],
                        'avatar': user[4],
                        'is_premium': user[5]
                    }
                }),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'action должен быть register или login'}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
