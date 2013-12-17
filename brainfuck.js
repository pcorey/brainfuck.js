function Block(state) {
   this.blocks = [];
   this.state = state; //{i, o, d, p}
}

Block.prototype.executeCode = function(code) {
   for (var j = 0; j < code.length; j++) {
      var i = code[j];
      switch (i) {
         case '>':
            this.state.p++;
         if (this.state.p >= this.state.d.length) {
            var len = this.state.d.length;
            for (var k = 0; k < len; k++) {
               this.state.d.push(0);
            }
         }
         break;
         case '<':
            this.state.p--;
         if (this.state.p < 0) {
            this.state.p = 0;
         }
         break;
         case '+':
            this.state.d[this.state.p]++;
            if (this.state.d[this.state.p] > 255) {
               this.state.d[this.state.p] = 0;
            }
         break;
         case '-':
            this.state.d[this.state.p]--;
            if (this.state.d[this.state.p] < 0) {
               this.state.d[this.state.p] = 255;
            }
         break;
         case '.':
            this.state.o.push(String.fromCharCode(this.state.d[this.state.p]));
         break;
         case ',':
            if (this.state.i.length > 0) {
               this.state.d[this.state.p] = this.state.i.pop().charCodeAt(0);
            }
         break;
         case '[':
            throw "loop encountered";
         case ']':
            throw "loop encountered";
      }
   }
};

Block.prototype.execute = function(){
   var that = this;
   this.blocks.forEach(function (block) {
      if (block.constructor === Block) {
         while (that.state.d[that.state.p] !== 0) {
            console.log(that.state.d[that.state.p]);
            block.execute();
         }
      }
      else {
         that.executeCode(block);
      }
   });
};

function parseBlocks(code, state) {
   var root = new Block(state),
       curr = root,
       stack = [],
       block = '';
   for (var i = 0; i < code.length; i++) {
      switch (code[i]) {
         case '[':
            curr.blocks.push(block);
            block = '';
            var next = new Block(state);
            curr.blocks.push(next);
            stack.push(curr);
            curr = next;
            break;
         case ']':
            curr.blocks.push(block);
            curr = stack.pop();
            block = '';
            break;
         default: block += code[i];
      }
   }
   if (block.length > 0) {
      curr.blocks.push(block);
   }
   return root;
}

function brainfuck(code, input) {
   var state = {
      i: input.split('').reverse(),
      o: [],
      d: [0,0,0,0,0,0,0,0,0,0],
      p: 0
   };
   var blocks = parseBlocks(code, state);
   blocks.execute();
   return state.o.join('');
}

brainfuck(',>,>,>,<<<.>.>.>.', 'Hello');

brainfuck(',[.[-],]', 'Codewars' + String.fromCharCode(0));

brainfuck(',+[-.,+]', 'Codewars' + String.fromCharCode(255));
