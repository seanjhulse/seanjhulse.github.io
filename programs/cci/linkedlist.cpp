#include "linkedlist.h"
#include "node.h"

LinkedList::LinkedList() {}
LinkedList::~LinkedList() {}
Node* LinkedList::add_node(int data) {
	Node* temp = root;
	while(temp->next) {
		temp = temp->next;
	}
	temp->next = new Node(data);
	return temp->next;
}

