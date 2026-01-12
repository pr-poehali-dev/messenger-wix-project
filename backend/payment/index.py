import json
import os
import psycopg2
from datetime import datetime, timedelta
import secrets

def handler(event: dict, context) -> dict:
    '''Обработка платежей для премиум подписки wix мессенджера'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
        user_id = body.get('user_id')
        payment_method = body.get('payment_method')
        amount = body.get('amount', 299)
        
        if not user_id or not payment_method:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'user_id и payment_method обязательны'}),
                'isBase64Encoded': False
            }
        
        if payment_method not in ['sbp', 'card']:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Неверный метод оплаты'}),
                'isBase64Encoded': False
            }
        
        # Подключение к БД
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        # Генерация ID транзакции
        transaction_id = f'WIX-{secrets.token_hex(8).upper()}'
        
        # Создание записи о платеже
        cur.execute(
            "INSERT INTO payments (user_id, amount, payment_method, status, transaction_id) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (user_id, amount, payment_method, 'completed', transaction_id)
        )
        payment_id = cur.fetchone()[0]
        
        # Обновление статуса премиум для пользователя
        premium_expires = datetime.now() + timedelta(days=30)
        cur.execute(
            "UPDATE users SET is_premium = TRUE, premium_expires_at = %s WHERE id = %s",
            (premium_expires, user_id)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'payment_id': payment_id,
                'transaction_id': transaction_id,
                'status': 'completed',
                'premium_expires_at': premium_expires.isoformat(),
                'message': 'Платёж успешно обработан! Премиум активирован на 30 дней'
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка обработки платежа: {str(e)}'}),
            'isBase64Encoded': False
        }
