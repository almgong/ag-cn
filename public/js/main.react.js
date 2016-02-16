/**
 * All react.js code needed to define components and functionality
**/
var MainReact = (function () {
	/******* components *********/
	var Board = React.createClass({				//entire board for client
		getInitialState: function() {	//initial state
			return {data:[]};
		},
		getBoardState: function() {
			$.ajax({
				url: this.props.url,
				cache:false,
				success:function(d) {
					console.log("polled for board state");
					this.setState({data:d});
				}.bind(this),
				error:function(xhr, status, err) {
					console.log('an error occurred in grabbing board state');
				}.bind(this)
			});
		},
		componentDidMount: function() {	//is called after first render
			var iid = setInterval(this.getBoardState, this.props.pollInterval);
			this.iid = iid;
			$('#game-room').fadeIn();
			//this.getBoardState();
			setTimeout(function() {
				GameManager.init();
				$('#loading-animation').fadeOut(400);
			}, 3000);
		},
		render: function() {
			var i = 0;
			var rows = this.state.data.map(function(row) {
				return (
					<Row data={row} rowNum={i++} />
				);
			});

			return (
				<div>
		    	<div className="game-board text-center">
		        	{rows}
		      	</div>
		      	</div>
    		);
		}
	});
  

  	var Row = React.createClass({				//a row of cards
  		render: function() {
  			var i = 0;
  			var cards = this.props.data.map(function(card) {
  				return (
  					<Card data={card} colNum={i++} />
  				);
  			});
  			return (
  				<div className="game-row row" data-id={"row-" + this.props.rowNum}>
  					<div className="col-sm-1"></div>{cards}<div className="col-sm-1"></div>
  				</div>
  			);
  		}
  	});


	var Card = React.createClass({				//an individual card
		render:function() {
			var classes = "game-card col-sm-2 team-" + this.props.data.color;
			return (
				<div className={classes} data-id={"col-" + this.props.colNum} data-owner={this.props.data.owner_team}>
					{this.props.data.word}
				</div>
			);
		}
	});




  	/* REACT RENDERING */
  	/**	ReactDOM.render(
  		<Board url="/board/state/room-1" pollInterval={2000} />,
  		$('#game-room-body')[0]
  	);**/



	/**
	 * Represents an OOP class for contructing and destroying generic react.js 
	 * elements
	**/
	"use strict";
	class ReactObject {

	  constructor(url, container) {
	    this._container = container;
	    this._url = url;
	    this._render();
	  }

	  _render() {
	    ReactDOM.render(
	      <Board url={this._url} pollInterval={2000} />,
	      this._container
	    );
	  }

	  get url() {
	    return this._url;
	  }

	  set url(value) {
	    this._url = value;
	    this._render();
	  }

	  destroy() {
	    ReactDOM.unmountComponentAtNode(this._container);
	  }
	}

	window.ReactObject = ReactObject;

})();