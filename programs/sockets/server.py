#!/usr/bin/env python3

import socket

HOST = '127.0.0.1'
PORT = 65432

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
	# binds this instance of a socket to the HOST and PORT
	s.bind((HOST, PORT))
	# listens for a connection
	s.listen()
	conn, addr = s.accept()
	with conn:
		print('Connected by', addr)
		while True:
			data = conn.recv(1024)
			# empty data set (eg. b'')
			if not data:
				break
			conn.sendall(data)