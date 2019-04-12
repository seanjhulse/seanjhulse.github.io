#!/usr/bin/env python3

import socket

HOST = '127.0.0.1'
PORT = 65432

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
	s.connect((HOST, PORT))
	s.setblocking(False)
	for i in range(0, 10):
		s.sendall(bytes(str(i), encoding= "utf-8"))

	print('Received', repr(data))