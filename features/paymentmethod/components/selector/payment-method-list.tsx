                                    <Pressable
                                        onPress={() => {
                                            onSelect(method);
                                            close();
                                        }}
                                        className={`border rounded-lg p-3 flex-row justify-between items-center mb-2 ${selectedId && selectedId === method.id ? 'bg-primary/10 border-primary' : ''}`}
                                    >
