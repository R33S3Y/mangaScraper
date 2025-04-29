import http.server
import socketserver

# Define the port you want to use
PORT = 8000

# Define a request handler
class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
    pass

# Create a server instance
with socketserver.TCPServer(("", PORT), MyRequestHandler) as httpd:
    print("Server started at localhost:", PORT)
    # Start the server
    httpd.serve_forever()
