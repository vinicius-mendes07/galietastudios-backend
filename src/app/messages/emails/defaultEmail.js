function defaultEmail(emailContent) {
  return `
  <!DOCTYPE HTML
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

  <head>
    <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->

    <title></title>
    <style type="text/css">
      body {
        color: #fff;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;

      }

      .container {
        max-width: 500px;
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin: 0 auto;
        padding: 10px;
        background-color: #000;
        box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
      }

      .logo {
        width: 250px;
        display: block;
        margin: 0 auto;
      }

      h1 {
        margin: 0;
        font-size: 22px;
        text-align: center;
        font-weight: 400;
        color: #fff;

      }

      span {
        color: #fff;
        display: block;
      }

      p {
        padding: 5px 0;
        font-size: 14px;
        color: #fff;
      }

      @media (max-width: 520px) {
        h1 {
          font-size: 18px;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <img src="https://eastus1-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=192810&inputFormat=jpeg&cs=MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!FjoLcDpeMkqx8qT7-Vfv4-lhWXNiVy1LhoHNwhoq8pmzRBlQJVXIRbXqd8oUSWhb%2Fitems%2F01FFHJDOFXYW54C3WT5FE3G54FE6N5OFEK%3Ftempauth%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNzA5MzgwODAwIiwiZXhwIjoiMTcwOTQwMjQwMCIsImVuZHBvaW50dXJsIjoiQUlhak90VWJMbnBYL2U3UWMyY0VNblZtT1hIODNaRHEzSWlZRVBqUVVvST0iLCJlbmRwb2ludHVybExlbmd0aCI6IjE2NCIsImlzbG9vcGJhY2siOiJUcnVlIiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6Ik56QXdZak5oTVRZdE5XVXpZUzAwWVRNeUxXSXhaakl0WVRSbVltWTVOVGRsWm1VeiIsImFwcF9kaXNwbGF5bmFtZSI6IkNvbnN1bWVyIEFwcDogMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDQ4MTcxMGE0IiwiYXBwaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwNDgxNzEwYTQiLCJ0aWQiOiI5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJ1cG4iOiJ2aW5pY2l1cy5oZW5yaXF1ZS45MkBob3RtYWlsLmNvbSIsInB1aWQiOiIwMDA2MDAwMEY2REQwOEZEIiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MDAwNjAwMDBmNmRkMDhmZEBsaXZlLmNvbSIsInNjcCI6ImFsbHNpdGVzLmZ1bGxjb250cm9sIiwic2lkIjoiMTA0OTQ1MTk3Mzc5MjIzMzkxMDEiLCJ0dCI6IjIiLCJpcGFkZHIiOiIxNzAuMjQ1LjcxLjI4In0.ogMJGGtrKRLGWs5Mngt3wEYjPeziKSRW5NyQTHYYNyI%26version%3DPublished&cb=63844978039&encodeFailures=1&width=577&height=577" alt="logo" class="logo">

      ${emailContent}
    </div>
  </body>

  </html>
  `;
}

module.exports = defaultEmail;
