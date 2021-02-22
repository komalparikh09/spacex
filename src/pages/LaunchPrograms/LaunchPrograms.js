import React, { Component } from 'react';
import axios from 'axios';
import LaunchCards from '../../components/LaunchCards/LaunchCards';
import CustomChatbot from '../../components/CustomChatbot/CustomChatbot';
import './LaunchPrograms.css';
import config from './../../configs';

var launchYearArr = [];
var launchSuccessArr = [];
var launchLandingArr = [];
var filteredLaunchesArr = [];
var successValues = ['True', 'False'];

class LaunchProgramsPage extends Component {

  state = {
    isLoading: true,
    launches: [],
    filteredLaunches: [],
    selectedFilter: '',
    launchYearsSelected: [],
    launchSuccessSelected: [],
    launchLandingSelected: [],
    filterClass: 'filterBox',
    isActive: false,
    btnToggleId: [],
    _id: ''
  };

  componentDidMount() {
    this.setState({ isLoading: false, filteredLaunches: [] });
    launchYearArr = [];
    launchSuccessArr = [];
    launchLandingArr = [];
    filteredLaunchesArr = [];
    this.fetchData();
  }

  fetchData = () => {
    // axios.get('https://api.spacexdata.com/v3/launches?limit=100' + this.state.selectedFilter)
    //   .then(res => {
    //     const launchResponse = res.data;
    //     for (var i = 0; i < launchResponse.length; i++) {
    //       if (launchResponse[i].rocket.first_stage.cores[0].land_success == null && !launchResponse[i].rocket.first_stage.cores[0].landing_intent) {
    //         launchResponse[i]["launch_landing"] = 'N/A';
    //       }
    //       else if (launchResponse[i].rocket.first_stage.cores[0].land_success == null && launchResponse[i].rocket.first_stage.cores[0].landing_intent) {
    //         launchResponse[i]["launch_landing"] = 'false';
    //       }
    //       else if (launchResponse[i].rocket.first_stage.cores[0].land_success) {
    //         launchResponse[i]["launch_landing"] = 'true';
    //       }
    //       else if (!launchResponse[i].rocket.first_stage.cores[0].land_success) {
    //         launchResponse[i]["launch_landing"] = 'false';
    //       }
    //       if (launchResponse[i].launch_success) {
    //         launchResponse[i]["launch_success"] = 'true';
    //       }
    //       else {
    //         launchResponse[i]["launch_success"] = 'false';
    //       }
    //       launchResponse[i]["image"] = images[this.getRandomIn(10)];
    //       launchResponse[i]["_id"] = i;
    //     }
    //     //this.props.history.replace('/launchprograms' + this.state.selectedFilter);
    //     this.setState({ launches: launchResponse });
    //   })
    //   .catch(err => {
    //     this.setState({ isLoading: false, launches: [] });
    //     this.props.onError('Loading search results for launches failed. Please try again later.');
    //     console.log(err);
    //   });
    this.setState({ isLoading: true });
    let request;
    request = axios.get(`${config.config.SERVER_URI}/launches`);
    request
      .then(res => {
        const launchResponse = res.data;
        this.setState({ isLoading: false, launches: launchResponse });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError(
          'Fetching launch programs failed. Please try again later.'
        );
      });
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.state;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // for (var i = 0; i < this.state.btnToggleId; i++) {
    //   var btnFilter = document.getElementById(this.state.btnToggleId[i]);
    //   btnFilter.className = "filterBoxSelected";
    // }
  }

  getRandomIn = max => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  inputChangeHandler = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  addLaunchHandler = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    var launchData = null;
    for (var i = 0; i < this.state.launches.length; i++) {
      launchData = this.state.launches[i];
      let request;
      request = axios.post(`${config.config.SERVER_URI}/launches`, launchData);
      request
        .then(result => {
          this.setState({ isLoading: false });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          this.props.onError(
            'Adding the launch programs failed. Please try again later.'
          );
        });
    }
  }

  filterLaunches = event => {
    event.preventDefault();
    filteredLaunchesArr = [];
    this.setState({ isLoading: true, filteredLaunches: [] });
    if (launchYearArr.length === 0) {
      for (var i = 2006; i <= 2020; i++) {
        launchYearArr.push(i);
      }
    }
    if (launchSuccessArr.length === 0) {
      launchSuccessArr = ['true', 'false'];
    }
    if (launchSuccessArr.length >= 3) {
      launchSuccessArr.splice(0, 1);
      launchSuccessArr.splice(0, 1);
    }
    if (launchLandingArr.length === 0) {
      launchLandingArr = ['true', 'false', 'N/A'];
    }
    if (launchLandingArr.length >= 4) {
      launchLandingArr.splice(0, 1);
      launchLandingArr.splice(0, 1);
      launchLandingArr.splice(0, 1);
    }
    const launchSearchData = {
      launch_year: launchYearArr,
      launch_success: launchSuccessArr,
      launch_landing: launchLandingArr
    };
    let request;
    request = axios.get(`${config.config.SERVER_URI}/searchlaunches/`, { params: launchSearchData });
    request
      .then(result => {
        this.setState({ isLoading: false });
        this.props.history.replace('/launchprograms' + this.state.selectedFilter);
        const filteredLaunchResponse = result.data;
        filteredLaunchesArr = filteredLaunchResponse;
        var obj = {};
        for (var i = 0, len = filteredLaunchesArr.length; i < len; i++) {
          obj[filteredLaunchesArr[i]['_id']] = filteredLaunchesArr[i];
        }
        filteredLaunchesArr = [];
        for (var key in obj) {
          filteredLaunchesArr.push(obj[key]);
        }
        if (launchSuccessArr.length === 1 && launchSuccessArr[0] === 'true') {
          filteredLaunchesArr = filteredLaunchesArr.filter(function (launch) {
            return launch.launch_success === 'true';
          });
        }
        else if (launchSuccessArr.length === 1 && launchSuccessArr[0] === 'false') {
          filteredLaunchesArr = filteredLaunchesArr.filter(function (launch) {
            return launch.launch_success === 'false';
          });
        }
        if (launchLandingArr.length === 1 && launchLandingArr[0] === 'true') {
          filteredLaunchesArr = filteredLaunchesArr.filter(function (launch) {
            return launch.launch_landing === 'true';
          });
        }
        else if (launchLandingArr.length === 1 && launchLandingArr[0] === 'false') {
          filteredLaunchesArr = filteredLaunchesArr.filter(function (launch) {
            return launch.launch_landing === 'false';
          });
        }
        this.setState({ filteredLaunches: filteredLaunchesArr });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError(
          'Filtering launches failed. Please try again later.'
        );
      });
  };

  selectFilter = (event, btnId) => {
    var btnFilter = document.getElementById(btnId);
    this.setState({ isActive: !this.state.isActive, filteredLaunches: [] });
    if (btnFilter.classList.contains('filterBoxSelected')) {
      btnFilter.classList.remove('filterBoxSelected');
      btnFilter.classList.add('filterBox');
    }
    else if (btnFilter.classList.contains('filterBox')) {
      btnFilter.classList.remove('filterBox');
      btnFilter.classList.add('filterBoxSelected');
    }
    if (btnFilter.className.includes('filterBoxSelected')) {
      btnFilter.className = 'filterBoxSelected';
      var btnSelectedId = [...this.state.btnToggleId];
      btnSelectedId.push(btnId);
      this.setState({ btnToggleId: btnSelectedId });
      this.addFilter(event, btnId);
      this.filterLaunches(event);
    }
    else {
      var btnSelectedId = [...this.state.btnToggleId];
      delete btnSelectedId[btnSelectedId.indexOf(btnId)];
      this.setState({ btnToggleId: btnSelectedId });
      this.removeFilter(event, btnId);
      this.filterLaunches(event);
    }
  };

  addFilter = (event, filterId) => {
    var filterEl = document.getElementById(filterId);
    var filterId;
    filterId = filterEl.id;
    var filter = this.state.selectedFilter;
    if (!isNaN(filterId)) {
      filter = filter.concat('/launch_year=' + filterId);
      launchYearArr.push(filterId);
      this.setState(prevState => ({
        launchYearsSelected: [...prevState.launchYearsSelected, filterId]
      }));
    }
    else if (filterId.includes('launchSuccessTrue')) {
      filter = filter.concat('/launch_success=true');
      launchSuccessArr.push('true');
      this.setState(prevState => ({
        launchSuccessSelected: [...prevState.launchSuccessSelected, 'true']
      }));
    }
    else if (filterId.includes('launchSuccessFalse')) {
      filter = filter.concat('/launch_success=false');
      launchSuccessArr.push('false');
      this.setState(prevState => ({
        launchSuccessSelected: [...prevState.launchSuccessSelected, 'false']
      }));
    }
    else if (filterId.includes('landSuccessTrue')) {
      filter = filter.concat('/land_success=true');
      launchLandingArr.push('true');
      this.setState(prevState => ({
        launchLandingSelected: [...prevState.launchLandingSelected, 'true']
      }));
    }
    else if (filterId.includes('landSuccessFalse')) {
      filter = filter.concat('/land_success=false');
      launchLandingArr.push('false');
      this.setState(prevState => ({
        launchLandingSelected: [...prevState.launchLandingSelected, 'false']
      }));
    }
    this.setState({ selectedFilter: filter });
  };

  removeFilter = (event, filterId) => {
    var filterEl = document.getElementById(filterId);
    var filterId;
    filterId = filterEl.id;
    var filter = this.state.selectedFilter;
    if (!isNaN(filterId)) {
      filter = filter.replace('/launch_year=' + filterId, '');
      launchYearArr.splice(launchYearArr.indexOf(filterId), 1);
      let curr = [...this.state.launchYearsSelected];
      curr.splice(curr.indexOf(filterId), 1);
      this.setState({ launchYearsSelected: curr });
    }
    else if (filterId.includes('launchSuccessTrue')) {
      filter = filter.replace('/launch_success=true', '');
      launchSuccessArr.splice(launchSuccessArr.indexOf('true'), 1);
      let curr = [...this.state.launchSuccessSelected];
      curr.splice(curr.indexOf('true'), 1);
      this.setState({ launchSuccessSelected: curr });
    }
    else if (filterId.includes('launchSuccessFalse')) {
      filter = filter.replace('/launch_success=false', '');
      launchSuccessArr.splice(launchSuccessArr.indexOf('false'), 1);
      let curr = [...this.state.launchSuccessSelected];
      curr.splice(curr.indexOf('false'), 1);
      this.setState({ launchSuccessSelected: curr });
    }
    else if (filterId.includes('landSuccessTrue')) {
      filter = filter.replace('/land_success=true', '');
      launchLandingArr.splice(launchLandingArr.indexOf('true'), 1);
      let curr = [...this.state.launchLandingSelected];
      curr.splice(curr.indexOf('true'), 1);
      this.setState({ launchLandingSelected: curr });
    }
    else if (filterId.includes('landSuccessFalse')) {
      filter = filter.replace('/land_success=false', '');
      launchLandingArr.splice(launchLandingArr.indexOf('false'), 1);
      let curr = [...this.state.launchLandingSelected];
      curr.splice(curr.indexOf('false'), 1);
      this.setState({ launchLandingSelected: curr });
    }
    this.setState({ selectedFilter: filter });
  };

  renderLaunchYearFilter() {
    var evenYears = [];
    var oddYears = [];
    for (var i = 2006; i <= 2020; i = i + 2) {
      evenYears.push(i);
    }
    for (var i = 2007; i <= 2019; i = i + 2) {
      oddYears.push(i);
    }
    var evenYearContent = evenYears.map((key, index) => {
      return (
        <span key={key}>
          <button type="button" id={key} className="filterBox"
            onClick={(event) => this.selectFilter(event, key)}><span className="filterBoxText">{key}</span></button>
          <br />
          <br />
        </span>
      )
    });
    var oddYearContent = oddYears.map((key, index) => {
      return (
        <span key={key}>
          <button type="button" id={key} className="filterBox"
            onClick={(event) => this.selectFilter(event, key)}><span className="filterBoxText">{key}</span></button>
          <br />
          <br />
        </span>
      )
    });
    return (
      <table className="filter-table" cellSpacing="10" cellPadding="10">
        <colgroup>
          <col width="50%" />
          <col width="50%" />
        </colgroup>
        <tbody>
          <tr>
            <td valign="top">
              {evenYearContent}
            </td>
            <td valign="top">
              {oddYearContent}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderLaunchSuccessFilter() {
    var launchSuccessContent = successValues.map((sval, index) => {
      return (
        <td key={sval}>
          <button type="button" id={`launchSuccess${sval}`} className="filterBox switchColor"
            onClick={(event) => this.selectFilter(event, `launchSuccess${sval}`)}><span className="filterBoxText">{sval}</span></button>
          <br />
        </td>
      )
    });
    return (
      <table className="filter-table" cellSpacing="10" cellPadding="10">
        <colgroup>
          <col width="50%" />
          <col width="50%" />
        </colgroup>
        <tbody>
          <tr>
            {launchSuccessContent}
          </tr>
        </tbody>
      </table>
    );
  }

  renderLaunchLandingFilter() {
    var landSuccessContent = successValues.map((sval, index) => {
      return (
        <td key={sval}>
          <button type="button" id={`landSuccess${sval}`} className="filterBox switchColor"
            onClick={(event) => this.selectFilter(event, `landSuccess${sval}`)}><span className="filterBoxText">{sval}</span></button>
          <br />
        </td>
      )
    });
    return (
      <table className="filter-table" cellSpacing="10" cellPadding="10">
        <colgroup>
          <col width="50%" />
          <col width="50%" />
        </colgroup>
        <tbody>
          <tr>
            {landSuccessContent}
          </tr>
        </tbody>
      </table>
    );
  }

  render() {

    let filter = (
      <div className="filter-div">
        <b><h3>Filters</h3></b>
        <div>
          <h5 className="filter-name">Launch Year</h5>
          <hr className="line-divider" />
          {this.renderLaunchYearFilter()}
        </div>
        <div>
          <h5 className="filter-name">Successful Launch</h5>
          <hr className="line-divider" />
          {this.renderLaunchSuccessFilter()}
        </div>
        <div>
          <h5 className="filter-name">Successful Landing</h5>
          <hr className="line-divider" />
          {this.renderLaunchLandingFilter()}
        </div>
      </div>
    );

    let launchCards = (
      <div>
        {this.state.selectedFilter.length > 0 ? filteredLaunchesArr.length > 0 ? <LaunchCards launches={filteredLaunchesArr} /> : <span className="center-span"><h4>Oops! No SpaceX Launch Programs found for the chosen filter.</h4></span> : <LaunchCards launches={this.state.launches} />}
      </div>
    );

    let content = null;
    content = (
      <div>
        <br />
        <br />
        <b><h1>SpaceX Launch Programs</h1></b>
        {/* <button id="addlaunch" onClick={this.addLaunchHandler}>Add Launch Programs</button> */}
        <div className="left-div">
          {filter}
        </div>
        <div className="right-div">
          {this.state.isLoading ? <div>Loading...</div> : launchCards}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <footer className="prev-next"><b><span>Developed by:  </span></b><span>Komal K. Parikh</span></footer>
          <br />
        </div>
        <CustomChatbot />
      </div>
    );
    return <main>{content}</main>;
  }
}

export default LaunchProgramsPage;