// Klaytn IDE uses solidity 0.4.24, 0.5.6 versions.
pragma solidity >=0.4.24 <=0.5.6;

contract JJBW_SINALEE {
    constructor() public {

    }

    struct Trashes {
        uint256 trashID;
        bytes32 status;
        bytes32 imageSrc;
        bytes32 location;
        bytes32 trashKind;
        uint256 klay;
        bool isExist;
    }

    // add Event For logging

    // Init
    event onInit(
        uint256 trashID,
        bytes32 imageSrc,
        bytes32 location,
        bytes32 trashKind
    );

    event onUpdateStatus(
        uint256 trashID,
        bytes32 status
    );

    event onUpdateKlay(
        uint256 trashID,
        uint256 klay
    );

    // mapping
    mapping (uint256 => Trashes) public trashes;

    // check is id is unique
    modifier isIDisUnique(uint256 _id) {
        require(
            trashes[_id].isExist == false,
            "_id is already used."
        );
        _;
    }

    // check is trashes is isExist
    modifier trashExists(uint256 _id) {
        require(
            trashes[_id].isExist,
            "given id doesn't exist"
        );
        _;
    }

    // init default
    function init(
        uint256 _id,
        bytes32 _imageSrc,
        bytes32 _location,
        bytes32 _trashKind
    )
    public
    isIDisUnique(_id)
    returns (bool) {
        trashes[_id].trashID = _id;
        trashes[_id].status = "PENDING";
        trashes[_id].imageSrc = _imageSrc;
        trashes[_id].location = _location;
        trashes[_id].trashKind = _trashKind;
        trashes[_id].isExist = true;

        emit onInit(_id, _imageSrc, _location, _trashKind);

        return true;
    }

    // update status
    function updateStatus(uint256 _id, bytes32 _status)
    public
    trashExists(_id)
    {
        emit onUpdateStatus(_id, _status);
        trashes[_id].status = _status;
    }

    // update klay
    function updateKlay(uint256 _id, uint256 _klay)
    public
    trashExists(_id)
    {
        emit onUpdateKlay(_id, _klay);
        trashes[_id].klay = _klay;
    }

    // get trash
    function getTrashInfo(uint256 _id)
    public
    view
    trashExists(_id)
    returns (
        uint256 trashID,
        bytes32 status,
        bytes32 imageSrc,
        bytes32 location,
        bytes32 trashKind,
        uint256 klay
    ) {
        return ((
        trashes[_id].trashID,
        trashes[_id].status,
        trashes[_id].imageSrc,
        trashes[_id].location,
        trashes[_id].trashKind,
        trashes[_id].klay
        ));
    }
}
