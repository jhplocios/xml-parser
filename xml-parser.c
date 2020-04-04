#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

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

_Bool isTag (char c, char prev) {
    return isValid(c) && (prev == '<' || prev == '/');  
}

int tokenizer (char* buffer) {
    int initial = 10;
    int top = 0;
    char** stack = (char**) malloc(initial*sizeof(char*));       
    if (stack == NULL) {
        printf("Error! Memory not allocated.");
        exit(1);
    }
    
    for (int i=0; i<initial; ++i) {
        *(stack+i) = (char*) malloc(256*sizeof(char));
    }
    
    for (int i=0; i<strlen(buffer); ++i) {
        if (top == initial) {
            char** temp = realloc(stack, top*2);
            if (temp == NULL) {
                printf("Error! memory not allocated");
            } else {
                stack = temp;
                for (int i=top; i<top*2; ++i) {
                    *(stack+i) = (char*) malloc(256*sizeof(char));
                }
            }
        }
        
        char c = *(buffer+i);
        char prev = *(buffer+i-1);
        int isNotValid = 0;
        
        if (isSymbol(c)) {
            printf("%c - symbol\n", c);
            *(*(stack + top)) = c;
        } else if (isOperator(c)) {
            printf("%c - operator\n", c);
        } else if (isTag(c, prev)) {
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
        }
    }
    
    if (stack) free(stack);
    return 1;
}

int main() {

    /* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
    int bufferLength = 255;
    char buffer[bufferLength];
    int isValid = 1;

    while (fgets(buffer, bufferLength, stdin) && isValid) {
        isValid = tokenizer(buffer);
        //printf("%d = %s", tokenizer(buffer), buffer);
    }
    
    return 0;
}