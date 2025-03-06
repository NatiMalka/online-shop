# הגדרת מערכת שליחת אימיילים עם EmailJS

כדי לאפשר שליחת אימיילים לבעל החנות וללקוחות, יש להגדיר את EmailJS. הנה המדריך המלא:

## שלב 1: הרשמה ל-EmailJS

1. היכנס לאתר [EmailJS](https://www.emailjs.com/) והירשם לחשבון חינמי.
2. לאחר ההרשמה, היכנס לחשבון שלך.

## שלב 2: הגדרת שירות אימייל

1. לחץ על "Email Services" בתפריט הניווט.
2. לחץ על "Add New Service".
3. בחר בשירות האימייל שברצונך להשתמש בו (Gmail, Outlook, וכו').
4. הזן את פרטי החשבון שלך ולחץ על "Connect Account".
5. תן שם לשירות (לדוגמה: "store-service") ושמור את ה-Service ID.

## שלב 3: יצירת תבניות אימייל

### תבנית לבעל החנות

1. לחץ על "Email Templates" בתפריט הניווט.
2. לחץ על "Create New Template".
3. בחר בשירות האימייל שיצרת בשלב הקודם.
4. הזן את הפרטים הבאים:
   - Template Name: "Store Owner Notification"
   - Subject: `הזמנה חדשה #{{order_id}}`
   - Email Body:
   ```html
   <!DOCTYPE html>
   <html dir="rtl" lang="he">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>הזמנה חדשה</title>
     <style>
       body {
         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
         line-height: 1.6;
         color: #333;
         background-color: #f9f9f9;
         margin: 0;
         padding: 0;
       }
       .container {
         max-width: 600px;
         margin: 0 auto;
         background-color: #ffffff;
         border-radius: 8px;
         overflow: hidden;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
       }
       .header {
         background-color: #2e7d32;
         color: white;
         padding: 20px;
         text-align: center;
       }
       .content {
         padding: 20px 30px;
       }
       .customer-details {
         background-color: #f5fff5;
         border-radius: 6px;
         padding: 15px;
         margin: 20px 0;
       }
       .delivery-details {
         background-color: #fff8f5;
         border-radius: 6px;
         padding: 15px;
         margin: 20px 0;
       }
       .items {
         background-color: #f9f9f9;
         border-radius: 6px;
         padding: 15px;
         margin-bottom: 20px;
         font-family: monospace;
         white-space: pre-wrap;
       }
       .total {
         font-size: 18px;
         font-weight: bold;
         color: #2e7d32;
         text-align: left;
         padding: 10px;
         border-top: 1px solid #eee;
       }
       .footer {
         background-color: #f5f5f5;
         padding: 15px;
         text-align: center;
         font-size: 14px;
         color: #666;
       }
       h2 {
         color: #2e7d32;
         margin-top: 0;
       }
       .info-row {
         display: flex;
         justify-content: space-between;
         border-bottom: 1px solid #eee;
         padding: 8px 0;
       }
       .info-label {
         font-weight: bold;
         color: #555;
       }
       .notes {
         background-color: #fffde7;
         border-radius: 6px;
         padding: 15px;
         margin: 20px 0;
         border-left: 4px solid #ffd600;
       }
     </style>
   </head>
   <body>
     <div class="container">
       <div class="header">
         <h1>התקבלה הזמנה חדשה!</h1>
       </div>
       <div class="content">
         <h2>פרטי ההזמנה #{{order_id}}</h2>
         
         <div class="customer-details">
           <h3>פרטי הלקוח:</h3>
           <div class="info-row">
             <span class="info-label">שם:</span>
             <span>{{customer_name}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">אימייל:</span>
             <span>{{customer_email}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">טלפון:</span>
             <span>{{customer_phone}}</span>
           </div>
         </div>
         
         <div class="delivery-details">
           <h3>פרטי המשלוח:</h3>
           <div class="info-row">
             <span class="info-label">כתובת:</span>
             <span>{{delivery_address}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">תאריך:</span>
             <span>{{delivery_date}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">שעה:</span>
             <span>{{delivery_time}}</span>
           </div>
         </div>
         
         <h3>פריטים שהוזמנו:</h3>
         <div class="items">{{items}}</div>
         
         <div class="total">סה"כ לתשלום: {{total}}</div>
         
         <div class="notes">
           <h3>הערות:</h3>
           <p>{{notes}}</p>
         </div>
       </div>
       <div class="footer">
         <p>הודעה זו נשלחה באופן אוטומטי ממערכת החנות האונליין.</p>
       </div>
     </div>
   </body>
   </html>
   ```
5. לחץ על "Save" ושמור את ה-Template ID.

### תבנית ללקוח

1. לחץ על "Create New Template" שוב.
2. בחר בשירות האימייל שיצרת.
3. הזן את הפרטים הבאים:
   - Template Name: "Customer Confirmation"
   - Subject: `אישור הזמנה #{{order_id}}`
   - Email Body:
   ```html
   <!DOCTYPE html>
   <html dir="rtl" lang="he">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>אישור הזמנה</title>
     <style>
       body {
         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
         line-height: 1.6;
         color: #333;
         background-color: #f9f9f9;
         margin: 0;
         padding: 0;
       }
       .container {
         max-width: 600px;
         margin: 0 auto;
         background-color: #ffffff;
         border-radius: 8px;
         overflow: hidden;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
       }
       .header {
         background-color: #4a6da7;
         color: white;
         padding: 20px;
         text-align: center;
       }
       .content {
         padding: 20px 30px;
       }
       .order-details {
         background-color: #f5f8ff;
         border-radius: 6px;
         padding: 15px;
         margin: 20px 0;
       }
       .items {
         background-color: #f9f9f9;
         border-radius: 6px;
         padding: 15px;
         margin-bottom: 20px;
         font-family: monospace;
         white-space: pre-wrap;
       }
       .total {
         font-size: 18px;
         font-weight: bold;
         color: #4a6da7;
         text-align: left;
         padding: 10px;
         border-top: 1px solid #eee;
       }
       .footer {
         background-color: #f5f5f5;
         padding: 15px;
         text-align: center;
         font-size: 14px;
         color: #666;
       }
       h2 {
         color: #4a6da7;
         margin-top: 0;
       }
       .button {
         display: inline-block;
         background-color: #4a6da7;
         color: white;
         text-decoration: none;
         padding: 10px 20px;
         border-radius: 4px;
         margin: 20px 0;
       }
       .info-row {
         display: flex;
         justify-content: space-between;
         border-bottom: 1px solid #eee;
         padding: 8px 0;
       }
       .info-label {
         font-weight: bold;
         color: #555;
       }
     </style>
   </head>
   <body>
     <div class="container">
       <div class="header">
         <h1>תודה על הזמנתך!</h1>
       </div>
       <div class="content">
         <h2>שלום {{customer_name}},</h2>
         <p>הזמנתך התקבלה בהצלחה ותטופל בהקדם.</p>
         
         <div class="order-details">
           <h3>פרטי ההזמנה:</h3>
           <div class="info-row">
             <span class="info-label">מספר הזמנה:</span>
             <span>{{order_id}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">תאריך משלוח:</span>
             <span>{{delivery_date}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">שעת משלוח:</span>
             <span>{{delivery_time}}</span>
           </div>
           <div class="info-row">
             <span class="info-label">כתובת למשלוח:</span>
             <span>{{delivery_address}}</span>
           </div>
         </div>
         
         <h3>פריטים שהזמנת:</h3>
         <div class="items">{{items}}</div>
         
         <div class="total">סה"כ לתשלום: {{total}}</div>
         
         <p>התשלום יתבצע במזומן בעת המסירה.</p>
         
         <p>אם יש לך שאלות נוספות, אל תהסס/י לפנות אלינו.</p>
       </div>
       <div class="footer">
         <p>בברכה,<br>צוות החנות</p>
         <p>© 2023 החנות האונליין שלך. כל הזכויות שמורות.</p>
       </div>
     </div>
   </body>
   </html>
   ```
4. לחץ על "Save" ושמור את ה-Template ID.

## שלב 4: עדכון הקוד

פתח את הקובץ `src/pages/Checkout.jsx` ועדכן את הפרטים הבאים:

1. החלף את `'YOUR_SERVICE_ID'` עם ה-Service ID שקיבלת בשלב 2.
2. החלף את `'YOUR_TEMPLATE_ID'` עם ה-Template ID של תבנית בעל החנות שיצרת בשלב 3.
3. החלף את `'CUSTOMER_TEMPLATE_ID'` עם ה-Template ID של תבנית הלקוח שיצרת בשלב 3.
4. החלף את `'YOUR_PUBLIC_KEY'` עם ה-Public Key של חשבון EmailJS שלך (ניתן למצוא ב-Account > API Keys).
5. החלף את `'store@example.com'` עם כתובת האימייל של בעל החנות.

## שלב 5: בדיקה

1. הפעל את האפליקציה עם `npm run dev`.
2. הוסף מוצרים לסל הקניות.
3. עבור לדף התשלום ומלא את הפרטים.
4. לחץ על "אשר הזמנה".
5. בדוק את תיבת הדואר של בעל החנות ושל הלקוח (כתובת האימייל שהזנת בטופס) כדי לוודא שהאימיילים התקבלו.

## הערות

- בחשבון החינמי של EmailJS, יש מגבלה של 200 אימיילים בחודש.
- אם אתה מתכנן לשלוח יותר אימיילים, שקול לשדרג לחשבון בתשלום.
- ודא שהאימיילים לא מגיעים לתיקיית הספאם. 