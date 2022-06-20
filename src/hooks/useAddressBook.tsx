import { useState } from "react";

const useAddressBook = (user: string) => {
  const cachedAddressBook = localStorage.getItem("gr_addressBook__" + user);
  const [addressBook, setAddressBook] = useState(
    cachedAddressBook ? JSON.parse(cachedAddressBook) : []
  );

  const addAddress = (value: { address: string; name: string }) => {
    const newAddressBook = [
      {
        value: value.address,
        label: value.name,
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGqSURBVHgBnVTLbcJAEF0bJMSNdGA6IBUAFYQOAhUEX0CccC78LlYqwKkAUkEowR1kS/CJn2Q771nexES242Wk9axmPW/efHYNkYrjOK1mszk3DGMYx3FL6ImcTqdtbgxlWa/XHlQXy46iKKiKZJomg+/g057NZrJOo+u6rev1+gxjH8aD0JDlcmkB9DcAP+fzWaUo85w2m00Hjj1RQeri/+ifqGnCAmWRaRayyMcsAyQYlH86nR5YI+wlbNtSn6ID1hXKQtdfMQEBWQF0BFuPzLUBlYRhmB0hi5/L5VI4BYU1tG07QM32THGxWNhJdNN0UU+PjLUBKXD2kfKgVqvtlA370hktTHm1Ws3BaEyybEramBGCDMF8LHQYsuhg5tAZV+o9c+QBLIB9i7RzU88FBLMONUcF4E72DLbkujUajQEDVAIEO47IAbqbdw6GB9TSzzvLBZxMJvy5L+6QG0DeDNTIEvoi1WzeACKVD6y9qC49lOUFj8ujatBfhl6abiVJpyHIdjv7wH5B+WjGW0U8Nm+A9cT5VO/oDyDfPM4Xth2hKWR5PB7bZPoNqljWhJyzkjoAAAAASUVORK5CYII=",
        group: "Address Book",
        reference: value.address,
        insertValue: true,
        isAddressBook: true,
      },
      ...addressBook,
    ];
    localStorage.setItem(
      "gr_addressBook__" + user,
      JSON.stringify(newAddressBook)
    );
    setAddressBook(newAddressBook);
  };

  const editAddress = (value: { address: string; name: string }) => {
    if (value.name && value.address) {
      const newAddressBook = [
        ...addressBook.map((addr: { value: string; label: string }) => {
          if (addr.value === value.address && addr.label === value.name) {
            return {
              ...addr,
              label: value.name,
              value: value.address,
              reference: value.address,
            };
          }
          return addr;
        }),
      ];
      localStorage.setItem(
        "gr_addressBook__" + user,
        JSON.stringify(newAddressBook)
      );
      setAddressBook(newAddressBook);
    }
  };

  const deleteAddress = (value: { address: string; name: string }) => {
    const newAddressBook = [
      ...addressBook.filter(
        (address: { value: string; label: string }) =>
          address.value !== value.address && address.label !== value.name
      ),
    ];
    localStorage.setItem(
      "gr_addressBook__" + user,
      JSON.stringify(newAddressBook)
    );
    setAddressBook(newAddressBook);
  };

  return {
    addressBook,
    setAddressBook,
    addAddress,
    editAddress,
    deleteAddress,
  };
};

export default useAddressBook;
