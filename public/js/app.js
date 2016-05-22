'use strict';

//config
var appConfig = {
  dataSourceForCompanies: '/api/companies.php',
  dataSourceForCompanyStock: function(company) {
    return '/api/stock.php?code=' + company.tickerCode;
  }
};

// Simple pure-React component so we don't have to remember Bootstrap's classes
var BootstrapButton = React.createClass({
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

// navigation bar
var MyNavBar = React.createClass({
  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">Start Bootstrap</a>
            </div>
            
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                    <li>
                        <a href="#">About</a>
                    </li>
                    <li>
                        <a href="#">Services</a>
                    </li>
                    <li>
                        <a href="#">Contact</a>
                    </li>
                </ul>
            </div>
            
        </div>
        
      </nav>
    );
  }
});

// page header component
var MyPageHeader = React.createClass({
  render: function() {
    return (
        <div className="row">
            <div className="col-md-12">
                <h2 className="page-header">
                    Cayman Parrot
                    <small> company stock news app</small>
                </h2>
            </div>
        </div>
    );
  }
});

// page footer
var MyPageFooter = React.createClass({
  render: function() {
    return (
      <footer>
        <div className="row">
        
          <div className="col-md-8">
            <address>
              <strong>Cayman Parrot Ltd.</strong><br />
              123 High St. London, AB1 2CD<br />
            </address>
          </div>
          
          <div className="col-md-4">
            <p>
              &copy; 2016 <a href="http://muratyaman.co.uk">Haci Murat Yaman</a><br />
              <abbr title="Phone">P:</abbr> +44-7944-866652
            </p>
          </div>
        </div>
      </footer>
    );
  }
});

// news card article
var MyCompanyNewsArticle = React.createClass({
  
  getDefaultProps: function() {
    return {
      article: null
    };
  },
  
  render: function() {
    
    var sentimentIcon = null;
    switch(this.props.article.sentiment) {
      case -1:
        sentimentIcon = (
          <i className="em em-disappointed"></i>
        );
        break;
      case 0:
        sentimentIcon = (
          <i className="em em-expressionless"></i>
        );
        break;
      case 1:
        sentimentIcon = (
          <i className="em em-grinning"></i>
        );
        break;
    }
    
    return (
      <div className="col-sm-6 col-md-6 my-news-article">
        <div className="thumbnail">
          <div className="caption">
            <h5>
              {this.props.article.headline} {sentimentIcon}
            </h5>
            <p className="text-justify my-news-article-body">
              {this.props.article.body}
            </p>
            <p>
              <a href="#" className="btn btn-default" role="button">More...</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
});


// company stock news card
var MyCompanyCard = React.createClass({
  
  getDefaultProps: function() {
    return {
      company: null,
      stock: null
    };
  },
  
  render: function() {
    
    var newsArticleList = [];
    for (var key in this.props.stock.storyFeed) {
      var article = this.props.stock.storyFeed[key];
      newsArticleList.push(
        <MyCompanyNewsArticle key={article.id} article={article} />
      );
    }
    
    return (
      <div>
      
        <div className="panel panel-info"> 
          <div className="panel-heading">{this.props.company.name} ({this.props.company.tickerCode})</div>
          <div className="panel-body">
              
            <div className="row">
              {newsArticleList}
            </div>
              
          </div>
          
          <ul className="list-group">
            <li className="list-group-item">
              <span className="badge">{this.props.stock.latestPriceFormatted}</span>
              <i className="em em-moneybag"></i> Price at {this.props.stock.asOfFormatted} was ...
            </li>
          </ul>
        </div>
        
      </div>
    );
  }
});


// company list item
var MyCompanyListItem = React.createClass({
  
  propTypes: {
    company: React.PropTypes.object.isRequired
  },
  
  handleCompanyClick: function(event) {
    console.log('handleCompanyClick');
    this.props.handleCompanyChange(this.props.company);
  },
  
  render: function() {
    return (
      <li className="list-group-item">
        <span className="badge">{this.props.company.tickerCode}</span>
        <a href="javascript:;" onClick={this.handleCompanyClick} title="Click to see details">
          <span className="glyphicon glyphicon-search" aria-hidden="true"></span> {this.props.company.name}
        </a>
      </li>
    );
  }
  
});

// company list component
var MyCompanyList = React.createClass({
  
  getInitialState: function() {
    return {
      selected_company: null,
      selected_stock: null
    };
  },
  
  getDefaultProps: function() {
    return {
      companies: []
    };
  },
  
  handleCompanyChange: function(company) {
    console.log('handleCompanyChange', company);
    var _this = this;
    _this.setState({
      selected_company: company,
      selected_stock: null
    });
    
    var src = appConfig.dataSourceForCompanyStock(company);
    $.get(src, function (stock) {
      console.log('get company stock', stock);
      var newState = _this.state;
      newState.selected_stock = stock;
      _this.setState(newState);
      //_this.refs.companyCard.stockReceived(newState.selected_stock);
    });
  },
  
  render: function() {
    var companies = this.props.companies;
    var companyList = [];
    for (var key in companies) {
      var company = companies[key];
      companyList.push(
        <MyCompanyListItem
          key={company.tickerCode} 
          company={company}
          handleCompanyChange={this.handleCompanyChange} 
        />
      );
    }
    
    var selectedCompanyCard = null;
    
    if (this.state.selected_stock) {
      selectedCompanyCard = (
        <MyCompanyCard 
          company={this.state.selected_company}
          stock={this.state.selected_stock}
        />
      );
    }
    
    return (
      <div className="row">
      
        <div className="col-sm-4 col-md-4">
        
          <div className="panel panel-default"> 
            <div className="panel-heading">HIGHLIGHTS</div>
            <div className="panel-body">
              <p>
              Nulla vitae elit libero, a pharetra augue. 
              Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. 
              Pellentesque ornare sem lacinia quam venenatis vestibulum. 
              Nullam id dolor id nibh ultricies vehicula ut id elit.
              </p>
            </div>
            <ul className="list-group">
              {companyList}
            </ul>
          </div>
        
        </div>
        
        <div className="col-sm-8 col-md-8">
          {selectedCompanyCard}
        </div>
        
      </div>
    );
  }
});


//home page
var MyHomePageContent = React.createClass({
  render: function() {
    return (
      <div className="container">
        <MyPageHeader />
        
        <MyCompanyList companies={this.props.companies} />
        
        <hr />
        <MyPageFooter />
      </div>
    );
  }
});

// app
var CaymanParrotApp = React.createClass({
  
  getInitialState: function() {
    return {
      companies: []
    };
  },
  
  componentDidMount: function() {
    this.serverRequest = $.get(
      this.props.datasource, // get datasource property of component
      function (result) {
        this.setState({
          companies: result
        });
    }.bind(this));
  },
  
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  render: function() {
    return (
      <div>
      
        <MyNavBar />
        <MyHomePageContent companies={this.state.companies} />
        
      </div>
    );
  }
});

ReactDOM.render(
  <CaymanParrotApp datasource={appConfig.dataSourceForCompanies} />,
  document.getElementById('caymanparrot')
);
