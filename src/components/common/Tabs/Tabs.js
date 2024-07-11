import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import Filter2TwoToneIcon from '@mui/icons-material/Filter2TwoTone';
import ViewFeed from "../ViewFeed/ViewFeed";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ user }) {
  const [value, setValue] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [ storeFeed, setStoreFeed ] = useState([])
  const mp3 = "/mp3image.jpg"

  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchAllUsersFeeds = async () => {
    const db = getFirestore();
    const usersCollection = collection(db, "feeds");

    try {
      const usersSnapshot = await getDocs(usersCollection);
      const feeds = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeeds(feeds);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllUsersFeeds();
  }, []);

  const handleFeedOpenModel = (feed) => {
    setStoreFeed([feed])
    setOpen(true)
    console.log('Clicked feed: ', feed)
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          color: "grey",
          width: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="#F3F5F7"
          indicatorColor="#F3F5F7"
          aria-label="basic tabs example"
        >
          <Tab
            label="CloudMix"
            {...a11yProps(0)}
            sx={{
              color: "#777777",
              marginRight: "30px",
            }}
          />
          <Tab
            label="Replies"
            {...a11yProps(1)}
            sx={{
              color: "#777777",
              marginRight: "30px",
              marginLeft: "30px",
            }}
          />
          <Tab
            label="Likes"
            {...a11yProps(2)}
            sx={{
              color: "#777777",
              marginLeft: "30px",
            }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0} style={{ color: "#F3F5F7" }}>
        <Box
          sx={{
            width:"900px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {feeds
            .filter((feed) => user?.userFeed?.includes(feed.id))
            .map((item) => (
              <Box
                key={item.id}
                onClick={() => handleFeedOpenModel(item)}
                sx={{
                  margin: "5px",
                  cursor: "pointer",
                  width: "150px",
                  height: "150px",
                  backgroundImage:item.image ? `url(${item.image})` : `url(${mp3})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  display:"flex", 
                  padding:"5px",
                  justifyContent:"flex-end",
                  borderRadius:"5px"
                }}
              >
                {item.audio && <Filter2TwoToneIcon fontSize="small"/>}
              </Box>
            ))}

            {!feeds && <h1 style={{colo:"red"}}>There are no feeds yet</h1>}
        </Box>
        <ViewFeed open={open} handleClose={handleClose} storeFeed={storeFeed}/>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1} style={{ color: "#F3F5F7" }}>
        <Box>Item Two</Box>
        <Box>Item One</Box>
        <Box>Item One</Box>
        <Box>Item One</Box>
        <Box>Item One</Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2} style={{ color: "#F3F5F7" }}>
        <Box>Item Three</Box>
        <Box>Item One</Box>
        <Box>Item One</Box>
        <Box>Item One</Box>
        <Box>Item One</Box>
      </CustomTabPanel>
    </Box>
  );
}
