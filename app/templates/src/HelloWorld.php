<?php

namespace <%= ps4Namespace %>;

/**
 * Class HelloWorld
 * @package <%= ps4Namespace %>
 */
class HelloWorld
{

    /**
     * @var string $name
     */
    protected $name;

    /**
     * @param string $name
     */
    public function __construct($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function sayHi()
    {
        return 'Hello ' . $this->name . '!';
    }
}
