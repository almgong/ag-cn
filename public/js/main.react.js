/**
 * All react.js code needed to define components and functionality
**/

var MainReact = (function () {

	var data = [[{"word":"elephant","color":null},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0}],[{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0}],[{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0}],[{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0},{"word":"elephant","color":0}]];

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
					this.setState({data:d});
				}.bind(this),
				error:function(xhr, status, err) {
					console.log('an error occurred in grabbing board state');
				}.bind(this)
			});
		},
		componentDidMount: function() {	//is called after first render
			this.getBoardState();
		},
		render: function() {
			var i = 0;
			var rows = this.state.data.map(function(row) {
				return (
					<Row data={row} rowNum={i++} />
				);
			});

			return (
		    	<div className="game-board">
		        	{rows}
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
  				<div className="game-row row" id={"row-" + this.props.rowNum}>
  					<div className="col-sm-1"></div>{cards}<div className="col-sm-1"></div>
  				</div>
  			);
  		}
  	});


	var Card = React.createClass({				//an individual card
		render:function() {
			return (
				<div className="game-card col-sm-2" id={"col-" + this.props.colNum}>
					{this.props.data.word}
				</div>
			);
		}
	});




  	/* REACT RENDERING */
  	ReactDOM.render(
  		<Board url="/board/state/test" pollInterval={1500} />,
  		$('#game-room')[0]
  	);

})();