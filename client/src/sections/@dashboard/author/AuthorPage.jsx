import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Alert } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";

import { useAuth } from "../../../hooks/useAuth";

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import AuthorTableHead from "./AuthorListHead";
import AuthorForm from "./AuthorForm";
import AuthorDialog from "./AuthorDialog";

import {
  applySortFilter,
  getComparator
} from "../../../utils/tableOperations";

import {
  apiUrl,
  methods,
  routes
} from "../../../constants";

const TABLE_HEAD = [
  {
    id: "photo",
    label: "Photo",
    alignRight: false
  },
  {
    id: "name",
    label: "Name",
    alignRight: false
  },
  {
    id: "description",
    label: "Description",
    alignRight: false
  },
  {
    id: "",
    label: "",
    alignRight: false
  }
];

const AuthorPage = () => {

  const { user } = useAuth();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [author, setAuthor] = useState({
    id: "",
    name: "",
    description: "",
    photoUrl: "",
    photoFile: null
  });

  const [authors, setAuthors] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);


  // GET ALL AUTHORS
  useEffect(() => {
    getAllAuthors();
  }, []);


  const getAllAuthors = () => {

    axios
      .get(apiUrl(routes.AUTHOR, methods.GET_ALL))
      .then((response) => {

        console.log(response.data);

        setAuthors(response.data.authorsList);
        setIsTableLoading(false);

      })
      .catch((error) => {

        console.log(error);

        setIsTableLoading(false);

        toast.error("Unable to load authors");

      });
  };


  // ADD AUTHOR
  const addAuthor = () => {

    const formData = new FormData();

    formData.append("name", author.name);

    formData.append(
      "description",
      author.description || ""
    );

    if (author.photoFile) {

      formData.append(
        "photo",
        author.photoFile
      );

    }

    axios
      .post(
        apiUrl(
          routes.AUTHOR,
          methods.POST
        ),
        formData
      )
      .then((response) => {

        console.log(
          "ADD AUTHOR:",
          response.data
        );

        toast.success(
          "Author added successfully"
        );

        handleCloseModal();

        getAllAuthors();

        clearForm();

      })
      .catch((error) => {

        console.error(
          "ADD AUTHOR ERROR:",
          error
        );

        console.error(
          "SERVER:",
          error.response?.data
        );

        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );

      });
  };


  // UPDATE AUTHOR
  const updateAuthor = () => {

    const formData = new FormData();

    formData.append(
      "name",
      author.name
    );

    formData.append(
      "description",
      author.description || ""
    );

    if (author.photoFile) {

      formData.append(
        "photo",
        author.photoFile
      );

    }

    axios
      .put(
        apiUrl(
          routes.AUTHOR,
          methods.PUT,
          selectedAuthorId
        ),
        formData
      )
      .then((response) => {

        console.log(
          "UPDATE AUTHOR:",
          response.data
        );

        toast.success(
          "Author updated successfully"
        );

        handleCloseModal();

        handleCloseMenu();

        getAllAuthors();

        clearForm();

      })
      .catch((error) => {

        console.error(
          "UPDATE AUTHOR ERROR:",
          error
        );

        console.error(
          "SERVER:",
          error.response?.data
        );

        toast.error(
          error.response?.data?.message ||
          "Something went wrong"
        );

      });
  };


  // DELETE AUTHOR
  const deleteAuthor = (authorId) => {

    axios
      .delete(
        apiUrl(
          routes.AUTHOR,
          methods.DELETE,
          authorId
        )
      )
      .then((response) => {

        toast.success(
          "Author deleted"
        );

        handleCloseDialog();

        handleCloseMenu();

        console.log(response.data);

        getAllAuthors();

      })
      .catch((error) => {

        console.log(error);

        toast.error(
          "Something went wrong"
        );

      });
  };


  // GET SELECTED AUTHOR
  const getSelectedAuthorDetails = () => {

    const selectedAuthor =
      authors.find(
        (element) =>
          element._id === selectedAuthorId
      );

    if (!selectedAuthor) {
      return;
    }

    setAuthor({

      id: selectedAuthor._id,

      name:
        selectedAuthor.name || "",

      description:
        selectedAuthor.description || "",

      photoUrl:
        selectedAuthor.photoUrl || "",

      photoFile: null

    });

  };


  // CLEAR FORM
  const clearForm = () => {

    setAuthor({

      id: "",

      name: "",

      description: "",

      photoUrl: "",

      photoFile: null

    });

  };


  // OPEN MENU
  const handleOpenMenu = (event) => {

    setIsMenuOpen(
      event.currentTarget
    );

  };


  // CLOSE MENU
  const handleCloseMenu = () => {

    setIsMenuOpen(null);

  };


  // OPEN DELETE DIALOG
  const handleOpenDialog = () => {

    setIsDialogOpen(true);

  };


  // CLOSE DELETE DIALOG
  const handleCloseDialog = () => {

    setIsDialogOpen(false);

  };


  // SORT TABLE
  const handleRequestSort = (
    event,
    property
  ) => {

    const isAsc =
      orderBy === property &&
      order === "asc";

    setOrder(
      isAsc
        ? "desc"
        : "asc"
    );

    setOrderBy(property);

  };


  // PAGINATION
  const handleChangePage = (
    event,
    newPage
  ) => {

    setPage(newPage);

  };


  const handleChangeRowsPerPage = (
    event
  ) => {

    setPage(0);

    setRowsPerPage(
      parseInt(
        event.target.value,
        10
      )
    );

  };


  // OPEN MODAL
  const handleOpenModal = () => {

    setIsModalOpen(true);

  };


  // CLOSE MODAL
  const handleCloseModal = () => {

    setIsModalOpen(false);

  };


  return (
    <>

      <Helmet>
        <title>
          Library App | Authors
        </title>
      </Helmet>


      <Container>

        {/* HEADER */}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >

          <Typography
            variant="h3"
            gutterBottom
          >
            Authors
          </Typography>


          {user.isAdmin && (

            <Button
              variant="contained"
              onClick={() => {

                setIsUpdateForm(false);

                clearForm();

                handleOpenModal();

              }}
              startIcon={
                <Iconify
                  icon="eva:plus-fill"
                />
              }
            >
              New Author
            </Button>

          )}

        </Stack>


        {/* TABLE */}

        {isTableLoading ? (

          <Grid
            padding={2}
            style={{
              textAlign: "center"
            }}
          >

            <CircularProgress />

          </Grid>

        ) : (

          <Card>

            <Scrollbar>

              {authors.length > 0 ? (

                <TableContainer
                  sx={{
                    minWidth: 800
                  }}
                >

                  <Table>

                    <AuthorTableHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={authors.length}
                      onRequestSort={
                        handleRequestSort
                      }
                    />


                    <TableBody>

                      {authors
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage +
                            rowsPerPage
                        )
                        .map((row) => {

                          const {
                            _id,
                            name,
                            description,
                            photoUrl
                          } = row;


                          return (

                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                            >

                              {/* PHOTO */}

                              <TableCell
                                align="center"
                              >

                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={4}
                                >

                                  <Avatar
                                    alt={name}
                                    src={photoUrl}
                                  />

                                </Stack>

                              </TableCell>


                              {/* NAME */}

                              <TableCell
                                align="left"
                              >

                                <Typography
                                  variant="subtitle2"
                                  noWrap
                                >

                                  {name}

                                </Typography>

                              </TableCell>


                              {/* DESCRIPTION */}

                              <TableCell
                                align="left"
                              >

                                {description}

                              </TableCell>


                              {/* ACTION */}

                              <TableCell
                                align="right"
                              >

                                {user.isAdmin && (

                                  <IconButton
                                    size="large"
                                    color="inherit"
                                    onClick={(e) => {

                                      setSelectedAuthorId(
                                        _id
                                      );

                                      handleOpenMenu(
                                        e
                                      );

                                    }}
                                  >

                                    <Iconify
                                      icon={
                                        "eva:more-vertical-fill"
                                      }
                                    />

                                  </IconButton>

                                )}

                              </TableCell>

                            </TableRow>

                          );

                        })}

                    </TableBody>

                  </Table>

                </TableContainer>

              ) : (

                <Alert
                  severity="warning"
                  color="warning"
                >
                  No authors found
                </Alert>

              )}

            </Scrollbar>


            {authors.length > 0 && (

              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  25
                ]}
                component="div"
                count={
                  authors.length
                }
                rowsPerPage={
                  rowsPerPage
                }
                page={page}
                onPageChange={
                  handleChangePage
                }
                onRowsPerPageChange={
                  handleChangeRowsPerPage
                }
              />

            )}

          </Card>

        )}

      </Container>


      {/* MENU */}

      <Popover
        open={
          Boolean(isMenuOpen)
        }
        anchorEl={
          isMenuOpen
        }
        onClose={
          handleCloseMenu
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75
            }
          }
        }}
      >

        <MenuItem
          onClick={() => {

            setIsUpdateForm(true);

            getSelectedAuthorDetails();

            handleCloseMenu();

            handleOpenModal();

          }}
        >

          <Iconify
            icon="eva:edit-fill"
            sx={{
              mr: 2
            }}
          />

          Edit

        </MenuItem>


        <MenuItem
          sx={{
            color: "error.main"
          }}
          onClick={
            handleOpenDialog
          }
        >

          <Iconify
            icon="eva:trash-2-outline"
            sx={{
              mr: 2
            }}
          />

          Delete

        </MenuItem>

      </Popover>


      {/* AUTHOR FORM */}

      <AuthorForm
        isUpdateForm={
          isUpdateForm
        }
        isModalOpen={
          isModalOpen
        }
        handleCloseModal={
          handleCloseModal
        }
        id={
          selectedAuthorId
        }
        author={
          author
        }
        setAuthor={
          setAuthor
        }
        handleAddAuthor={
          addAuthor
        }
        handleUpdateAuthor={
          updateAuthor
        }
      />


      {/* DELETE DIALOG */}

      <AuthorDialog
        isDialogOpen={
          isDialogOpen
        }
        authorId={
          selectedAuthorId
        }
        handleDeleteAuthor={
          deleteAuthor
        }
        handleCloseDialog={
          handleCloseDialog
        }
        handleCloseMenu={
          handleCloseMenu
        }
      />

    </>
  );
};

export default AuthorPage;