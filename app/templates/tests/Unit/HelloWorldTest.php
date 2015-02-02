<?php

namespace <%= ps4TestNamespace %>\Unit;

use <%= ps4Namespace %>\HelloWorld;

class HelloWorldTest extends \PHPUnit_Framework_TestCase
{
    public function testSayHi()
    {
        $hello = new HelloWorld('hal9087');
        $this->assertEquals('Hello hal9087!', $hello->sayHi());
    }
}
