import styled from 'styled-components';
import { NFTCard, NftPhoto } from './components/NFTCard';
import { useState, useEffect } from "react"
import { NFTModal } from './components/NFTModal';
import { ethers } from 'ethers';
import { connect } from './helpers';
const axios = require('axios');

function App() {

  let initialNfts = // Creem obiectele placeholder pana incarca imaginile din IPFS
  [
    { name: "Bootstrapper", symbol: "SBDAO", copies: 1, image: "https://via.placeholder.com/150" }, // super rare
    { name: "Veteran", symbol: "SBDAO", copies: 10, image: "https://via.placeholder.com/150" },
    { name: "Adopter", symbol: "SBDAO", copies: 100, image: "https://via.placeholder.com/150" },
    { name: "Sustainer", symbol: "SBDAO", copies: 1000, image: "https://via.placeholder.com/150" },
    { name: "Believer", symbol: "SBDAO", copies: 4000, image: "https://via.placeholder.com/150" },
  ]
  
  const [showModal, setShowModal] = useState(false)
  const [selectedNft, setSelectedNft] = useState()
  const [nfts, setNfts] = useState(initialNfts)

  useEffect( () => {

    ( async () => {
      const address = await connect()
      if (address) {
        getNfts(address)
      }
    })()

  }, [])


  function toggleModal(i) {
    if (i >= 0) {
      setSelectedNft(nfts[i])
    }
    setShowModal(!showModal)
  }

  async function getMetadataFromIpfs(tokenURI) {
    let metadata = await axios.get(tokenURI) // for http requests
    return metadata.data
  }

  async function getNfts(address) {
    const rpc = "https://rpc-mumbai.maticvigil.com/" //eventual https://www.alchemy.com/ 
    const ethersProvider = new ethers.providers.JsonRpcProvider(rpc)

    let abi = [ // extragem ABI intro forma mai usor citibila
      "function symbol() public view returns(string memory)",
      "function tokenCount() public view returns(uint256)",
      "function uri(uint256 _tokenId) public view returns(string memory)",
      "function balanceOfBatch(address[] accounts, uint256[] ids) public view returns(uint256[])"
    ]

    let nftCollection = new ethers.Contract(
      "0xContractAdress",
      abi,
      ethersProvider
    )

    let numberOfNfts = (await nftCollection.tokenCount()).toNumber()
    let collectionSymbol = await nftCollection.symbol()

    let accounts = Array(numberOfNfts).fill(address)
    let ids = Array.from({length: numberOfNfts}, (_, i) => i + 1)
    let copies = await nftCollection.balanceOfBatch(accounts, ids)

    
    // Pt. a nu apela blockchain-ul in for loop si a fi mai rapid si mai eficient
    let tempArray = [] 
    let baseUrl = ""

    for (let i = 1; i <= numberOfNfts; i++) {
      if (i == 1) { 
        let tokenURI = await nftCollection.uri(i)
        baseUrl = tokenURI.replace(/\d+.json/, "")  // reg. expr. pt a extrege baseUrl: de ex. din "ipfs.com/CID/1.json" devine "ipfs.com/CID/"
        let metadata = await getMetadataFromIpfs(tokenURI)
        metadata.symbol = collectionSymbol         // inject din blockchain
        metadata.copies = copies[i - 1]
        tempArray.push(metadata)
      } else {
        let metadata = await getMetadataFromIpfs(baseUrl + `${i}.json`)
        metadata.symbol = collectionSymbol
        metadata.copies = copies[i - 1]
        tempArray.push(metadata)
      }
    }
    setNfts(tempArray)
  } 
  return (
    <div className="App">
      <Container>
        <Title> Stakeborg Community Achievements </Title>
        <Subtitle> One for All and All for DAO </Subtitle>
        <Grid>
          {
            nfts.map((nft, i) =>  // classa anonima
              <NFTCard nft={nft} key={i} toggleModal={() => toggleModal(i)} />
            )
          }
        </Grid>
      </Container>
      {
        showModal &&
        <NFTModal
          nft={selectedNft}
          toggleModal={() => toggleModal()}
        />
      }

    </div>
  );
}

const Title = styled.h1`
  margin: 0;
  text-align: center;
`
const Subtitle = styled.h4`
  color: gray;
  margin-top: 0;
  text-align: center;
`
const Container = styled.div`
  width: 70%;
  max-width: 1200px;
  margin: auto;
  margin-top: 100px;
`

 /*Grid este super ok pt responsive*/
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  row-gap: 40px;

  @media(max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media(max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export default App;
