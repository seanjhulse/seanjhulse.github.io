#!/usr/bin/env python3

import socket
import selectors 

HOST = '127.0.0.1'
PORT = 65432

sel = selectors.DefaultSelector()

lsock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
lsock.bind((HOST, PORT))
lsock.setblocking(False)
sel.register(lsock, selectors.EVENT_READ, data=None)

try:
	while True:
		events = sel.select(timeout=None)
		for key, mask in events:
			if key.data is None:
				data, addr = lsock.recvfrom(4096)
				print(data)
			else:
				continue
except KeyboardInterrupt:
	print("caught keyboard interrupt, exiting")
finally:
		sel.close()