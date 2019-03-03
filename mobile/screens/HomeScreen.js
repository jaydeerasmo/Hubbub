import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  ListView
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import HubFeedItem from '../components/HubFeedItem';
import SearchableDropdown from 'react-native-searchable-dropdown';
import CreatePostModal from '../screens/CreatePostModal';
import { WebBrowser } from 'expo';

var friendsList;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      friendData: [],
      loading: true,
      data: [],
      error:null,
      user:props.user,
    };
  }

  arrayholder = [];

/*React calls this after all the elements of the page is rendered correctly*/
  componentDidMount(){
    const url = 'http://142.93.147.148:4000';
    this.setState({loading: true});

    fetch(url + '/api/v1/posts/allFriends/1')
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({
        data: resJson,
        loading: false,
      });
      console.log(resJson[0].title);
      this.arrayholder = resJson
    })
    .catch(error => {
      console.log("cannot get posts");
      this.setState({ error, loading:false });
    })

    fetch(url + '/api/v1/friend/1', {
      method: 'GET'
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({
        loading: false,
        friendData: responseJson,
      }, function(){

      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

/*sends another get request for posts to update the feed*/
  refreshHubFeed = () => {
    const url = 'http://142.93.147.148:4000';
    this.setState({loading: true});

    fetch(url + '/api/v1/posts/all')
    .then((res) => res.json())
    .then((resJson) => {
      this.setState({
        data: resJson,
      });
      console.log(resJson[0].title);
      this.arrayholder = resJson
    })
    .catch(error => {
      console.log("cannot get posts");
      this.setState({ error, loading:false });
    })
    this.setState({loading: false});
  }

/*render lines FlatList*/
  renderSeparator = () => (
    <View
      style={{
        backgroundColor: '#5e5f60',
        height: 0.5,
      }}
    />
  );

  render() {
    if(this.state.loading){
      return(
        <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
          <ActivityIndicator size='small' color="#d98880"/>
        </View>
      );
    }
    friendsList = this.state.friendData.map(function(item){
      return {
        id: item.user.id,
        name: item.user.firstName + " " + item.user.lastName
      };
    });
    console.log(this.state.data);

    return (
      <View style={styles.container}>
        <Header backgroundColor = "#a93226"
          leftComponent={
              <Icon
                iconStyle = {{left: 0}}
                name='alpha-h'
                type='material-community'
                size={50}
                color='#ccd1d1'
              />
          }
          centerComponent = {
            <SearchableDropdown
              onItemSelect={friendsList => alert(JSON.stringify(friendsList))}
              containerStyle={{padding: 10, width: 300, alignSelf: 'center'}}
              textInputStyle={{
                padding: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderColor: '#ccd1d1',
                borderRadius: 5,
                color: '#ccd1d1',
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: '#ccd1d1',
                borderColor: '#a93226',
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{color: '#000'}}
              itemsContainerStyle={{maxHeight: 130}}
              items={friendsList}
              placeholder="Search"
              underlineColorAndroid="transparent"
            />
          }
        />
        <FlatList
          data = {this.state.data}
          renderItem={({item}) => (
            <HubFeedItem
              name = {item.user.username}
              title = {item.title}
              rating = {item.rating}
              body = {item.body}
            />
          )}
          ItemSeparatorComponent = {this.renderSeparator}
          keyExtractor={item => item.id.toString()}
        />

        <CreatePostModal
          ref = {createPost => {this.createPost = createPost}}
          refreshFeed = {() => { this.refreshHubFeed()}}
        />
        <TouchableHighlight
          style={{position: 'absolute', alignSelf: 'flex-end', bottom: 0}}
          onPress={() => {
            this.createPost.setModalVisible(true);
          }}>
          <Icon
            reverse
            name='add-circle'
            type='material'
            size={24}
            color='#a93226'/>
        </TouchableHighlight>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});