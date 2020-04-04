#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

typedef struct {
  char token[50];
  char type[50];
} token;

int stack_size = 10;
int top_of_stack = 0;
token** stack;

_Bool isSymbol (char c) {
    return c == '<' || c == '>' || c == '/' || c == '?';
}

_Bool isOperator (char c) {
    return c == '=';
}

_Bool isAlphabet (char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

_Bool isNumeric (char c) {
    return c >= '0' && c <= '9';
}

_Bool isValid (char c) {
    return isAlphabet(c) || isNumeric(c) || c == '_';
}

_Bool isTag (char c, char prev, char prevprev) {
    return isValid(c) && (prev == '<' || (prevprev == '<' && prev == '/'));  
}

int parser (char* buffer) {    
    for (int i=0; i<strlen(buffer); ++i) {
        if (top_of_stack == stack_size) {
            token** temp = realloc(stack, stack_size*2);
            if (temp == NULL) {
                printf("Error! memory not allocated");
            } else {
                stack = temp;
                for (int i=top_of_stack; i<stack_size*2; ++i) {
                    *(stack+i) = (token*) malloc(sizeof(token));
                }
                stack_size = stack_size * 2; 
            }
        }
        
        char c = *(buffer+i);
        
        if (c == '<') {
          //*(*(stack + top_of_stack))->token = strdup(*(buffer+i));
          //*(*(stack + top_of_stack))->type = (char*) malloc(7*sizeof(char));
          *(stack[top_of_stack])->token = c;
          *(stack[top_of_stack])->type = strdup("symbol");
          ++top_of_stack;
        }
        
        /*
        char c = *(buffer+i);
        char prev = *(buffer+i-1);
        char prevprev = *(buffer+i-2);
        int isNotValid = 0;
        
        if (isSymbol(c)) {
            printf("%c - symbol\n", c);
            // *(*(stack + top)) = c;
        } else if (isOperator(c)) {
            printf("%c - operator\n", c);
        } else if (isTag(c, prev, prevprev)) {
            char* tag = (char*) malloc(128*sizeof(char));
            if (tag == NULL) {
                printf("Error! memory not allocated");
                exit(0);
            }
            int count = 0;
            
            while (*(buffer+i+count) != ' ' && *(buffer+i+count) != '>') {
                char x = *(buffer+i+count); 
                if (isValid(x)) {
                    *(tag + count) = *(buffer+i+count);
                    ++count;    
                } else {
                    isNotValid = 1;
                    break;
                }
            }
            
            if (isNotValid) {
                if (tag) free(tag);
                if (stack) free(stack);
                printf("Not valid\n");
                return 0;
            } else {
                printf("%s - tag\n", tag);    
            }
            free(tag); 
        }*/ 
    }
    
    return 1;
}

int main() {

    /* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
    int bufferLength = 255;
    char buffer[bufferLength];
    int isValid = 1;
    
    stack = (token**) malloc(stack_size*sizeof(token*));       
    if (stack == NULL) {
        printf("Error! Memory not allocated.");
        exit(1);
    }
  
    for (int i=0; i<stack_size; ++i) {
        stack[i] = (token*) malloc(sizeof(token));
    }

    while (fgets(buffer, bufferLength, stdin) && isValid) {
        isValid = parser(buffer);
        //printf("%d = %s", tokenizer(buffer), buffer);
    }
    
    if (stack) free(stack);

    return 0;
}


