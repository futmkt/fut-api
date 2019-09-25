<?php
	
	namespace FUTApi;
	
	class FutError extends \Exception {

    		private $_options;

    		public function __construct($message, $code = 0, Exception $previous = null, $options = array('params')) {
        		parent::__construct($message, $code, $previous);
        		$this->_options = $options; 
    		}

    		public function GetOptions() { return $this->_options; }
	
	}
	
?>
