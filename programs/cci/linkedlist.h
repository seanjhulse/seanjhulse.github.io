#ifndef LINKEDLIST_H
#define LINKEDLIST_H
#include "node.h"
class LinkedList {
	public:
		LinkedList();
		~LinkedList();

		Node* add_node(int);
	private:
		Node* root = nullptr;
};
#endif
