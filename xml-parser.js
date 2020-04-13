// GLOBAL
let token = [];
let token_count = -1;
let lexical = [];
let lexical_pointer = -1;
let syntax = [];
let syntax_pointer = -1;

let alphanumeric_input = '';
let keyboard_input = '';

let not_valid = false;
let is_attribute_value = false;
let is_closing_tag = false;
let pop_root = false;

let string = `<?xml version="1.0" encoding="UTF-8" ?>
<XMLFile>
    <Colors>
        <Color1>White</Color1>
        <Color2>Blue</Color2>
        <Color3>Black</Color3>
        <Color4 Special="Light\tOpaque">Green Lantern</Color4>
        <Color5>Red</Color5>
    </Colors>
    <Fruits>
        <Fruits1>Apple</Fruits1>
        <Fruits2>Pineapple</Fruits2>
        <Fruits3>Grapes</Fruits3>
        <Fruits4>Melon</Fruits4>
    </Fruits>
</XMLFile>
`

function is_symbol(c) {
  return c === '<' || c === '>' || c === '?' || c === '/'
}

function is_alphanumeric(c) {
  const regex = /[a-z0-9_]/ig;
  const match = c.match(regex)
  return !!match;
}

function is_keyboard_input(c) {
  const regex = /[a-z0-9_,./<>?:;\ '{}[\]\\|+=!@#$%^&*()-]/ig;
  const match = c.match(regex)
  return !!match;
}

function push_token(token_item, type) {
  token_count++;
  token[token_count] = { token: token_item, type };
}

function push_lexical(token_item, type) {
  lexical_pointer++;
  lexical[lexical_pointer] = { token: token_item, type };
}

function pop_lexical() {
  lexical = lexical.slice(0, lexical_pointer);
  lexical_pointer--; 
}

function push_syntax() {
  const obj = {};
  let temp_pointer = token_count;
  while(token[temp_pointer].token !== '<') {
    if (token[temp_pointer].type === 'tag') {
      obj['tag'] = token[temp_pointer].token;
    }
    temp_pointer--;
  }
  syntax_pointer++;
  syntax[syntax_pointer] = obj;
}

function pop_syntax(closing_tag) {
  if (closing_tag === syntax[syntax_pointer].tag) {
    syntax = syntax.slice(0, syntax_pointer);
    syntax_pointer--;
  }
}

function processData(input) {
  //Enter your code here
  for (let i=0; i<input.length; i++) {
    const cur = input[i];
    const prev = input[i-1];
    const next = input[i+1];

    // handle symbol literals
    if (cur === '<') {
      if (pop_root) {
        console.log('not valid', cur)
        not_valid = true;
      }

      keyboard_input = keyboard_input.trim();
      if (keyboard_input !== '') {
        push_token(keyboard_input, 'value');
        keyboard_input = '';
      }

      push_token(cur, 'symbol');
      push_lexical(cur, 'symbol');
      continue;
    }

    if (cur === '>') {
      if (prev === '/') {
        continue;
      }

      if (lexical.length > 0 && lexical[lexical_pointer].token === '<') {
        if (alphanumeric_input !== '') {
          push_token(alphanumeric_input, 'tag');
          
        }
        push_token(cur, 'symbol');
        pop_lexical(); 
        
      } else if (lexical.length > 0 && lexical[lexical_pointer].type === 'tag') {
        if (alphanumeric_input !== '') {
          not_valid = true;
          break;
        }
        pop_lexical();
        pop_lexical(); 
      } else { 
        console.log('not valid', cur)
        not_valid = true;
        break;
      }

      if (is_closing_tag) {
        if (syntax[syntax_pointer].tag === alphanumeric_input) {
          if (syntax_pointer === 1) {
            pop_root = true;
          }
          pop_syntax(alphanumeric_input);
        }
        is_closing_tag = false;
      } else {
        push_syntax();
      }

      alphanumeric_input = '';

      continue;
    }

    if (cur === '?') {
      push_token(cur, 'symbol');

      if (lexical.length > 0 && lexical[lexical_pointer].token === '?') {
        pop_lexical(); 
      } else if (lexical.length > 0 && lexical[lexical_pointer].type === 'tag') {
        pop_lexical(); 
        pop_lexical(); 
      } else {
        push_lexical(cur, 'symbol');
      }
      continue;
    }

    // handle alphanumeric literals
    if (lexical.length < 1) {
      if (cur === "\n" || cur === "\t") {
        continue;
      }

      if (is_keyboard_input(cur)) {
        keyboard_input += cur;
      } else {
        console.log('not valid', `.${cur}.`)
        not_valid = true;
        break;
      }
    } 

    if (lexical.length > 0) {
      const open_bracket_at_top = lexical[lexical_pointer].token === '<';
      const question_mark_at_top = lexical[lexical_pointer].token === '?';
      const tag_at_top = lexical[lexical_pointer].type === 'tag';
      const attribute_at_top = lexical[lexical_pointer].type === 'attribute';

      if (open_bracket_at_top || question_mark_at_top) {
        if (cur === ' ' && !tag_at_top) {
          if (next !== '/') {
            if (alphanumeric_input !== '') {
              push_token(alphanumeric_input, 'tag');
              push_lexical(alphanumeric_input, 'tag');
            }
          }
          alphanumeric_input = '';
          continue;
        }
      }

      if (tag_at_top || attribute_at_top) {
        if (cur === '=') {
          if (alphanumeric_input !== '') {
            push_token(alphanumeric_input, 'attribute');
            push_token(cur, 'operator');
            push_lexical(alphanumeric_input, 'attribute');
            alphanumeric_input = '';
          }
          continue;
        }

        if (cur === '"') {
          if (is_attribute_value) {
            if (keyboard_input !== '') {
              if (attribute_at_top) {
                push_token(keyboard_input, 'attribute value');
                pop_lexical();
                keyboard_input = '';
              } else {
                console.log('not valid', cur)
                not_valid = true;
                break;
              }
            }
          }

          is_attribute_value = !is_attribute_value;
          continue;
        }

        if (cur === " ") {
          continue;
        } 
      }

      if (cur === '/') {
        push_token(cur, 'symbol');

        if (next === '>') {
          alphanumeric_input = '';
          pop_lexical();
        }

        if (prev === '<') {
          is_closing_tag = true;
        }

        continue;
      }

      if (cur === " " || cur === "\t" || cur === "\n") {
        continue;
      }
      
      if (is_alphanumeric(cur) && !is_attribute_value) {
        alphanumeric_input += cur;
      } else if (is_attribute_value) {
        if (is_keyboard_input(cur)) {
          keyboard_input += cur;
        } else {
          console.log('not valid', `.${cur}.`)
          not_valid = true;
          break;
        }
      } else {
        console.log('not valid', cur)
        not_valid = true;
        break;
      }
    }
  }

  if (not_valid || lexical.length > 0 || syntax.length !== 1 || syntax[0].tag !== 'xml') {
    console.log('NO')
  } else {
    console.log('YES')
  }
  
  console.log(token);
  console.log(lexical);
  console.log(syntax);
} 

processData(string)
