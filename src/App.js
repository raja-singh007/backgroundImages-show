import React from 'react';
import "element-theme-default"
import './App.css';
import {Pagination, Loading} from'element-react' 
import {connect} from 'react-redux'
import {getImages} from "./actions";
import LazyImage from "./LazyImage";
class App extends React.Component{
  constructor(props){
    super(props);
    let pageNo = 1;
    let pageSize = 20;
    this.props.loadImages(pageNo,pageSize);    
    this.state = {
      pageNo,
      pageSize,
    }
    this.imageLoaded = this.imageLoaded.bind(this);
  }
  updatePageNo(pageNo){
    this.setState(state => {
      let tempState = Object.assign({},state);
      tempState.pageNo = pageNo;
      return tempState;
    },() => {
      window.stop();
      document.execCommand("Stop", false);
      this.props.loadImages(this.state.pageNo, this.state.pageSize)
    })
  }
  imageLoaded(index){
    if((index+1) < this.state.pageSize && this.state.urls[index].url.length > 0){
      let url = this.state.images[index+1].url;
      let urls = [...this.state.urls]
      urls[index+1].url = url;
      this.setState({
        urls
      })
    }
  }
  render(){
    
    return(
      <div>
        <Pagination className="pagination" pageSize={this.state.pageSize} layout={"prev, pager, next, jumper"}
          currentPage={this.state.pageNo} total={3344}
          onCurrentChange={this.updatePageNo.bind(this)}
        />
         <div className="container">
          {this.props.load ? <Loading></Loading> : this.props.images.map((item,index) => {
            return (
              <div className="Image" key={this.state.pageNo*this.state.pageSize + index}>
                <LazyImage
                src={item.url} alt={index}
                height={455} width={350}/>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
const getImagesFromState = state => state.images;
const isLoading = state => state.loading;
const mapStateToProps = state => ({
  images: getImagesFromState(state),
  load: isLoading(state)
})
const mapDispatchToProps = dispatch => ({
  loadImages: (pageNo,pageSize) => dispatch(getImages(pageNo,pageSize))
})
export default connect(mapStateToProps,mapDispatchToProps)(App);
